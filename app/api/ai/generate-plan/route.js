import { GoogleGenerativeAI } from "@google/generative-ai";

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

export async function POST(req, res) {
  // Wait 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return Response.json(MOCK_DATA);

  // Get message from request body
  const { url } = await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction:
      'Du er en kilde tjekker Agent, din del af processen går ud på at lave en plan som en anden Agent skal følge for at kunne undersøge en kildes troværdighed. Agenten som du laver planen til har adgang til diverse værktøjer til at undersøge hjemmesiden.\nVærktøjerne inkludere at kunne læse en sides indhold, klikke links, se billeder osv.\nDu skal lave en plan i et korrekt JSON objekt.\nEt eksempel på et output kunne være:\n{\n  "type": "object",\n  "properties": {\n    "steps": {\n      "type": "array",\n      "items": {\n        "type": "object",\n        "properties": {\n          "title": {\n            "type": "string"\n          }\n        }\n      }\n    }\n  }\n}\n\nBrug den lille information du får fra linket til at lave din plan ud fra, f.eks, hvis det er en wikipedia side, så ved du at der ikke kun er 1 forfatter, men at Agenten måske burde undersøge alle de kilde som wiki siden bruger.\nMen hvis det er et blog opslag, så burde du nok tjekke mere om forfatteren, deres færdigheder osv. Eller hvornår det er opslået.\nPlanen skal være simpel at forså, let læslig for Agenten osv.\n\nHvert step skal være omkring 3 til 5 ord langt.\n\nEn plan skal være mellem 3 og 10 steps.\nDu modtager KUN et URL, og dit svar skal KUN være JSON objektet.',
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
    },
  };

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  console.log(url); // TODO: Remove this lin

  const result = await chatSession.sendMessage(url);

  const message = result.response.candidates[0].content.parts[0].text;

  const jsonMessage = JSON.parse(message).steps;

  return Response.json({ plan: jsonMessage });
}
