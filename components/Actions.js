"use server";

import { createClient } from "@/utils/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { redirect } from "next/navigation";

export async function createOrGetPlan(url) {
  if (!isUrlValid(url)) {
    return { error: "Invalid URL" };
  }

  const supabase = await createClient();

  const {
    data: { user: user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/signin");
  }

  const { data, error } = await supabase
    .from("searches")
    .select("plan")
    .eq("url", url);

  if (error) {
    console.log(error);
    return { error: "Database fejl" };
  }

  if (data[0]) {
    return data[0].plan;
  }

  const plan = await generatePlan(url);

  const { response, addError } = await supabase
    .from("searches")
    .insert([
      {
        url: url,
        plan: plan,
        user_id: (await supabase.auth.getUser()).data.user.id,
      },
    ])
    .select();

  if (addError) {
    console.log(addError);
    return { error: "Database fejl" };
  }

  return plan;
}

async function generatePlan(url) {
  const res = await aiGen(
    'Du er en kilde tjekker Agent, din del af processen går ud på at lave en plan som en anden Agent skal følge for at kunne undersøge en kildes troværdighed. Agenten som du laver planen til har adgang til diverse værktøjer til at undersøge hjemmesiden.\nVærktøjerne inkludere at kunne læse en sides indhold, klikke links, se billeder osv.\nDu skal lave en plan i et korrekt JSON objekt.\nEt eksempel på et output kunne være:\n{\n  "type": "object",\n  "properties": {\n    "steps": {\n      "type": "array",\n      "items": {\n        "type": "object",\n        "properties": {\n          "title": {\n            "type": "string"\n          }\n        }\n      }\n    }\n  }\n}\n\nBrug den lille information du får fra linket til at lave din plan ud fra, f.eks, hvis det er en wikipedia side, så ved du at der ikke kun er 1 forfatter, men at Agenten måske burde undersøge alle de kilde som wiki siden bruger.\nMen hvis det er et blog opslag, så burde du nok tjekke mere om forfatteren, deres færdigheder osv. Eller hvornår det er opslået.\nPlanen skal være simpel at forså, let læslig for Agenten osv.\n\nHvert step skal være omkring 3 til 5 ord langt.\n\nEn plan skal være mellem 3 og 10 steps.\nDu modtager KUN et URL, og dit svar skal KUN være JSON objektet. DIT SVAR SKAL ALTID VÆRE PÅ DANSK.',
    {
      steps: {
        type: "array",
        items: {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
          },
        },
      },
    },
    url
  );

  return res.steps;
}

async function aiGen(systemPrompt, schema, prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
  });

  const generationConfig = {
    temperature: 2,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseModalities: [],
    responseMimeType: "application/json",
    responseSchema: {
      type: "object",
      properties: schema,
    },
  };

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);

  const message = result.response.candidates[0].content.parts[0].text;

  const jsonMessage = JSON.parse(message);

  return jsonMessage;
}

function isUrlValid(userInput) {
  var regexQuery =
    "^(https?:\\/\\/)?((([-a-z0-9]{1,63}\\.)*?[a-z0-9]([-a-z0-9]{0,253}[a-z0-9])?\\.[a-z]{2,63})|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d{1,5})?((\\/|\\?)((%[0-9a-f]{2})|[-\\w\\+\\.\\?\\/@~#&=])*)?$";
  var url = new RegExp(regexQuery, "i");
  return url.test(userInput);
}

const MOCK_DATA = {
  plan: [
    {
      title: "Læs artiklen grundigt igennem",
    },
    {
      title: "Undersøg forfatterens baggrund/ekspertise",
    },
    {
      title: "Tjek ugeskriftet troværdighed/omdømme",
    },
    {
      title: "Find eksterne kilder i artiklen",
    },
    {
      title: "Undersøg eksterne kilders validitet",
    },
    {
      title: "Er informationen stadig aktuel?",
    },
  ],
};
