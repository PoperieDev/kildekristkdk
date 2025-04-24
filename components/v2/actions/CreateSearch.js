"use server";

import { requireAuth } from "@/components/actions/AuthActions";
import { createClient } from "@/utils/supabase/server";
import GenAi from "./GenAi";
import {
  PLAN_STEP_PROMPT,
  RESEARCH_PROMPT,
  RESEARCH_STEP_PROMPT,
  RESEARCH_RESULT_PROMPT,
  CONCLUSION_PROMPT,
} from "./Prompts";

// Helper to add timeout to LLM calls
function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("LLM call timed out")), ms)
  );
  return Promise.race([promise, timeout]);
}

// Default timeout for LLM operations (ms)
const LLM_TIMEOUT = process.env.GENAI_TIMEOUT_MS
  ? parseInt(process.env.GENAI_TIMEOUT_MS)
  : 60000;

export async function createSearch(url) {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("searches")
    .insert([{ searchurl: url, user_id: user.id }])
    .select();

  if (error) {
    console.error(error);
    return { error: "Database fejl" };
  }

  const randomStepAmount = Math.floor(Math.random() * 6) + 3; // Random number between 3 and 8
  const steps = await createPlan(url, randomStepAmount);

  await createResearch(url, steps);
  // Once all research is done, generate and store a final conclusion
  await createConclusion(url);

  return data[0];
}

async function createResearch(url, steps) {
  const supabase = await createClient();

  for (const [idx, planStep] of steps.entries()) {
    // Mark this plan step as completed in the plansteps table
    await supabase
      .from("plansteps")
      .update({ completed: true })
      .eq("searchurl", url)
      .eq("index", idx);

    // Generate research object with timeout
    let researchObj;
    try {
      researchObj = await withTimeout(
        GenAi(
          RESEARCH_PROMPT,
          {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
            },
            required: ["title", "description"],
          },
          `URL: ${url} PLAN_STEP: ${planStep}`
        ),
        LLM_TIMEOUT
      );
    } catch (genErr) {
      console.error("Error generating research object for step", idx, genErr);
      continue;
    }

    // Override title so it matches the plan step exactly
    researchObj.title = planStep;

    // Insert into the research table
    const { data: researchData, error: researchError } = await supabase
      .from("research")
      .insert([
        {
          title: researchObj.title,
          description: researchObj.description,
          searchurl: url,
        },
      ])
      .select();
    if (researchError) {
      console.error(researchError);
      continue;
    }
    const researchRow = researchData[0];

    // Generate the first research step with timeout
    let researchStepObj;
    try {
      researchStepObj = await withTimeout(
        GenAi(
          RESEARCH_STEP_PROMPT,
          {
            type: "object",
            properties: {
              title: { type: "string" },
              tool: { type: "string" },
              llm_result: { type: "string" },
            },
            required: ["title", "tool", "llm_result"],
          },
          `URL: ${url} TITLE: ${researchObj.title} DESCRIPTION: ${researchObj.description}`
        ),
        LLM_TIMEOUT
      );
    } catch (stepErr) {
      console.error(
        "Error generating research step for research",
        researchRow?.id,
        stepErr
      );
      // mark this research as failed
      await supabase
        .from("research")
        .update({
          completed: true,
          success: false,
          result: "Fejl under research step",
        })
        .eq("id", researchRow.id);
      continue;
    }

    // Insert into the researchsteps table
    const { data: stepData, error: stepError } = await supabase
      .from("researchsteps")
      .insert([
        {
          researchid: researchRow.id,
          title: researchStepObj.title,
          tool: researchStepObj.tool,
          searchurl: url,
          llm_result: researchStepObj.llm_result,
        },
      ])
      .select();
    if (stepError) {
      console.error(stepError);
      continue;
    }
    const stepRow = stepData[0];

    // Mark this research step as completed
    await supabase
      .from("researchsteps")
      .update({ completed: true })
      .eq("id", stepRow.id);

    // If the model requested FETCH_URL, extract the target URL and update llm_result
    if (researchStepObj.tool && researchStepObj.tool.startsWith("FETCH_URL")) {
      // Remove the keyword and trim to get the actual URL
      const fetchUrl = researchStepObj.tool.replace(/^FETCH_URL\s+/, "").trim();
      try {
        const response = await fetch(fetchUrl);
        const html = await response.text();
        await supabase
          .from("researchsteps")
          .update({ llm_result: html })
          .eq("id", stepRow.id);
      } catch (fetchError) {
        console.error("FETCH_URL error", fetchError);
      }
    }

    // Fetch all steps for final evaluation
    const { data: allSteps } = await supabase
      .from("researchsteps")
      .select("*")
      .eq("researchid", researchRow.id);

    // Generate final research result summary with timeout
    let researchResultObj;
    try {
      researchResultObj = await withTimeout(
        GenAi(
          RESEARCH_RESULT_PROMPT,
          {
            type: "object",
            properties: {
              success: { type: "boolean" },
              result: { type: "string" },
            },
            required: ["success", "result"],
          },
          `URL: ${url} TITLE: ${researchObj.title} DESCRIPTION: ${
            researchObj.description
          } RESEARCH_STEPS: ${JSON.stringify(allSteps)}`
        ),
        LLM_TIMEOUT
      );
    } catch (resErr) {
      console.error(
        "Error generating final research result for",
        researchRow.id,
        resErr
      );
      await supabase
        .from("research")
        .update({
          completed: true,
          success: false,
          result: "Fejl under research evaluering",
        })
        .eq("id", researchRow.id);
      continue;
    }

    // Update research with completion status
    const { error: updateError } = await supabase
      .from("research")
      .update({
        completed: true,
        success: researchResultObj.success,
        result: researchResultObj.result,
      })
      .eq("id", researchRow.id);
    if (updateError) {
      console.error(updateError);
    }
  }
}

/**
 * Generate a final conclusion for the full plan and insert into the results table
 */
async function createConclusion(url) {
  const supabase = await createClient();
  // Fetch all research entries for this URL
  const { data: researchEntries, error: fetchError } = await supabase
    .from("research")
    .select("title, description, result, success")
    .eq("searchurl", url);
  if (fetchError) {
    console.error("Error fetching research entries", fetchError);
    return;
  }
  // Call LLM to generate conclusion
  let conclusionObj;
  try {
    conclusionObj = await withTimeout(
      GenAi(
        CONCLUSION_PROMPT,
        {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            verified: { type: "boolean" },
          },
          required: ["title", "description", "verified"],
        },
        `URL: ${url} RESEARCH_ENTRIES: ${JSON.stringify(researchEntries)}`
      ),
      LLM_TIMEOUT
    );
  } catch (e) {
    console.error("Error generating conclusion", e);
    return;
  }
  // Insert into results table
  const { error: insertError } = await supabase.from("results").insert([
    {
      title: conclusionObj.title,
      description: conclusionObj.description,
      searchurl: url,
      verified: conclusionObj.verified,
    },
  ]);
  if (insertError) {
    console.error("Error inserting conclusion", insertError);
  }
}

async function createPlan(url, stepAmount) {
  const supabase = await createClient();

  const steps = [];

  for (let i = 0; i < stepAmount; i++) {
    // Generate plan step with timeout
    let res;
    try {
      res = await withTimeout(
        GenAi(
          PLAN_STEP_PROMPT,
          {
            type: "object",
            properties: { step: { type: "string" } },
          },
          `PLAN STEPS ALLEREDE GENERERET: ${steps.join(", ")} URL: ${url}`
        ),
        LLM_TIMEOUT
      );
    } catch (planErr) {
      console.error("Error generating plan step", i, planErr);
      break;
    }

    steps.push(res.step);
    const { data, error } = await supabase
      .from("plansteps")
      .insert([{ searchurl: url, text: res.step, index: i }])
      .select();
    if (error) {
      console.error(error);
    }

    console.log(res.step);
  }

  return steps;
}
