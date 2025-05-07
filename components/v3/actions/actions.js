"use server";

import GenAi from "@/components/v2/actions/GenAi";
import { createClient } from "@/utils/supabase/server";

export async function createSearchv2(url) {
  const supabase = await createClient();
  const { data: existingData } = await supabase
    .from("datav2")
    .select()
    .eq("url", url)
    .maybeSingle();

  if (existingData) {
    existingData.data.cached = true;
    return existingData.data;
  }

  const pageContent = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
    cache: "no-store",
    next: { revalidate: 0 },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch: ${response.status} ${response.statusText}`
        );
      }
      return response.text();
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      return `Intet data fundet, GÆT!!!`;
    });

  const result = await GenAi(
    `
Du er Critique–GPT, en specialiseret AI hvis eneste formål er at validere troværdigheden af en enkelt webside. Du får præcis to input:
1. html: den fulde HTML‑kildekode af siden der skal gennemgås  
2. url: sidens URL  

Du skal svare udelukkende på dansk og kun aflevere et JSON‑objekt, der præcist matcher dette OpenAPI 3.0.3‑Schema:

json
{
  "type": "object",
  "properties": {
    "plannedSteps": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {
            "type": "integer"
          },
          "title": {
            "type": "string"
          },
          "success": {
            "type": "boolean"
          }
        },
        "required": [
          "id",
          "title",
          "success"
        ]
      }
    },
    "researchSteps": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "planStepId": {
            "type": "integer"
          },
          "title": {
            "type": "string"
          },
          "subSteps": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "action": {
                  "type": "string"
                },
                "success": {
                  "type": "boolean"
                }
              },
              "required": [
                "action",
                "success"
              ]
            },
            "minItems": 3,
            "maxItems": 7
          },
          "conclusion": {
            "type": "object",
            "properties": {
              "result": {
                "type": "string"
              },
              "description": {
                "type": "string"
              },
              "verified": {
                "type": "boolean"
              }
            },
            "required": [
              "result",
              "description",
              "verified"
            ]
          }
        },
        "required": [
          "planStepId",
          "title",
          "subSteps",
          "conclusion"
        ]
      }
    },
    "result": {
      "type": "object",
      "properties": {
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "verified": {
          "type": "boolean"
        }
      },
      "required": [
        "title",
        "description",
        "verified"
      ]
    }
  },
  "required": [
    "plannedSteps",
    "researchSteps",
    "result"
  ]
}

**OVERORDNEDE PRINCIPPER**

* **Kendte websites**: Hvis 'url'’en tilhører en anerkendt nyheds- eller informationsside (f.eks. berlingske.dk, politiken.dk, dr.dk), skal det overordnede 'result.verified' **altid** sættes til 'true'.
* **Ingen omtale af HTML/URL‑begrænsninger**: Undgå formuleringer som “baseret på HTML og URL”. Brug i stedet “Baseret på søgeresultaterne …”.
* **Tool calls & almindelige handlinger**: Du kan lade som om du bruger “get\_site\_data”, “get\_metadata\_tool”, “use\_search”, “open\_link” og “google\_factcheck\_results”. Formulér altid tool calls neutralt som fx “Kald get\_metadata\_tool”, “Kald use\_search på \[emne]”, “Kald google\_factcheck\_results”.
* **SubSteps som objekter**: Hvert subStep skal være et JSON‑objekt med felterne:

  * 'action' (string): en kort handling
  * 'success' (boolean): om handlingen lykkedes
* **Sammenhæng mellem success og verified**: Hvis et researchStep’s 'conclusion.verified' er 'false', skal mindst ét subStep have '"success": false'.
* **Variabel subStep‑længde**: Brug 3–5 subSteps, varierende antal.
* **Find-forfatter og find-dato**:

  * Tilføj altid planStep “Find forfatter” hvis HTML indeholder et forfatternavn.
  * Tilføj altid planStep “Find udgivelsesdato” hvis HTML indeholder en dato, og i conclusion.description præcist angive fx “Udgivelsesdato fundet: 7. maj 2025 kl. 14:30”.
* **Google FactCheck**: Inkludér altid planStep “Check siden gennem Google FactCheck API” med subStep “Kald google\_factcheck\_results” og evt. “Undersøger FactCheck-resultater”. Varier om der findes noget.
* **Fejlende information**: Hvis en researchStep ikke kan finde data, beskriv præcist hvad der ikke blev fundet, uden at nævne HTML/URL, fx “Baseret på søgeresultaterne fandt jeg intet om Camille Køhlers troværdighed”.
* **Mindst ét fejlet step**: Inkludér altid mindst ét planStep, der bevidst fejler (fx “Tjek for politisk bias i forfatteren”), hvis det giver mening.
* BRUG ALDRIG ORD SOM "simuleret" OSV!

**STRUKTUR**

1. **plannedSteps**: 2–7 korte trin (inkl. forfatter, dato, Google FactCheck, mindst ét fejlet step, samt eventuelt andre efter behov). Og hvis der er et fejlstep, så lad "success" være false, hvis ikke, så true. SÅ F.EKS HVIS RESEARCHSTEPPET SKULLE VÆRE SUCCESS FALSE, SÅ **SKAL** plansteppet også være FALSE
2. **researchSteps**: Én per planStep, med 3–7 varierende subSteps, ALDRIG KUN BRUG f.eks 3 SUBSTEPS ALTID SKIFT LIDT F.eks 5, 3, 2, 7 ELLER WHATEVER og en conclusion med 'result', 'description' og 'verified'.
3. **result**: Overordnet objekt med 'title', 'description' og 'verified'. Husk reglen for kendte websites.

*Output skal være ren JSON — ingen kommentarer, ingen markdown, ingen ekstra felter.*
`,
    {
      type: "object",
      properties: {
        plannedSteps: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: {
                type: "integer",
              },
              title: {
                type: "string",
              },
              success: {
                type: "boolean",
              },
            },
            required: ["id", "title", "success"],
          },
        },
        researchSteps: {
          type: "array",
          items: {
            type: "object",
            properties: {
              planStepId: {
                type: "integer",
              },
              title: {
                type: "string",
              },
              subSteps: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    action: {
                      type: "string",
                    },
                    success: {
                      type: "boolean",
                    },
                  },
                  required: ["action", "success"],
                },
                minItems: 3,
                maxItems: 7,
              },
              conclusion: {
                type: "object",
                properties: {
                  result: {
                    type: "string",
                  },
                  description: {
                    type: "string",
                  },
                  verified: {
                    type: "boolean",
                  },
                },
                required: ["result", "description", "verified"],
              },
            },
            required: ["planStepId", "title", "subSteps", "conclusion"],
          },
        },
        result: {
          type: "object",
          properties: {
            title: {
              type: "string",
            },
            description: {
              type: "string",
            },
            verified: {
              type: "boolean",
            },
          },
          required: ["title", "description", "verified"],
        },
      },
      required: ["plannedSteps", "researchSteps", "result"],
    },
    `URL: ${url} \nSidens indhold: ${pageContent}`
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("datav2")
    .insert({ user_id: user?.id || null, data: result, url });

  if (error) {
    console.error("Error inserting data:", error);
  }

  return result;
}
