"use server";

import { createClient } from "@/utils/supabase/server";
import { generateFirstStep, generatePlan } from "./AiService";
import { isUrlValid } from "./ValidationUtils";
import { requireAuth } from "./AuthActions";

export async function createOrGetPlan(url) {
  if (!isUrlValid(url)) {
    return { error: "Invalid URL" };
  }

  const user = await requireAuth();
  const supabase = await createClient();

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
  //const firstStep = await generateFirstStep(plan);

  const planWithStatus = plan.map((item) => ({
    ...item,
    status: "pending",
  }));

  const { response, addError } = await supabase
    .from("searches")
    .insert([
      {
        url: url,
        plan: planWithStatus,
        user_id: user.id,
      },
    ])
    .select();

  if (addError) {
    console.log(addError);
    return { error: "Database fejl" };
  }

  return planWithStatus;
}
