"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateFirstStep(plan) {
  const res = await aiGen(
    `Du er en kilde tjekker Agent, din del af processen går ud på at lave en plan som en anden Agent skal følge for at kunne undersøge en kildes troværdighed. Agenten som du laver planen til har adgang til diverse værktøjer til at undersøge hjemmesiden. Du skal lave en plan i et korrekt JSON objekt.

De værtøjer du har adgang til er:
"GET_SITE_DATA"
- Laver en GET request på siden for at få dets indhold som HTML i plaintext.

Du skal tage en plan, et step index, og du skal lave et JSON objekt til de steps du har tænkt dig at tage først.

Du skal lave en titel som er ca. 5 ord lang der forklarere hvad du vil ca. gøre
Og en beskrivelse på ca. 15 ord som går lidt dybere ind
samt det første step du vil udfører, f. eks "Få sidens indhold" skal være meget kort, maks 3 - 4 ord eller whatever - og prøv at lyde klog
og hvis det er nødvendigt kan du skrive navnet på et værktøj/tool for at bruge det for at udfører steppet`,
    {
      type: "object",
      properties: {
        title: {
          type: "string",
        },
        description: {
          type: "string",
        },
        first_step: {
          type: "string",
        },
        tool: {
          type: "string",
        },
      },
      required: ["title", "description", "first_step"],
    },
    JSON.stringify(plan[0])
  );

  return res;
}

export async function generatePlan(url) {
  const res = await aiGen(
    'Du er en kilde tjekker Agent, din del af processen går ud på at lave en plan som en anden Agent skal følge for at kunne undersøge en kildes troværdighed. Agenten som du laver planen til har adgang til diverse værktøjer til at undersøge hjemmesiden.\nVærktøjerne inkludere at kunne læse en sides indhold, klikke links, se billeder osv.\nDu skal lave en plan i et korrekt JSON objekt.\nEt eksempel på et output kunne være:\n{\n  "type": "object",\n  "properties": {\n    "steps": {\n      "type": "array",\n      "items": {\n        "type": "object",\n        "properties": {\n          "title": {\n            "type": "string"\n          }\n        }\n      }\n    }\n  }\n}\n\nBrug den lille information du får fra linket til at lave din plan ud fra, f.eks, hvis det er en wikipedia side, så ved du at der ikke kun er 1 forfatter, men at Agenten måske burde undersøge alle de kilde som wiki siden bruger.\nMen hvis det er et blog opslag, så burde du nok tjekke mere om forfatteren, deres færdigheder osv. Eller hvornår det er opslået.\nPlanen skal være simpel at forså, let læslig for Agenten osv.\n\nHvert step skal være omkring 3 til 5 ord langt.\n\nEn plan skal være mellem 3 og 10 steps.\nDu modtager KUN et URL, og dit svar skal KUN være JSON objektet. DIT SVAR SKAL ALTID VÆRE PÅ DANSK.',
    {
      type: "object",
      properties: {
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
      required: ["steps"],
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
    responseSchema: schema,
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
