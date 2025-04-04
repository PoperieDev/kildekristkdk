"use server";

import { createClient } from "@/utils/supabase/server";

export async function createOrGetPlan(url) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("searches")
    .select("plan")
    .eq("url", url)

  if (error) {
    console.log(error);
    return null;
  }

  if (data[0]) {
    return data[0].plan;
  }

  const plan = await generatePlan(url);

  const { response, addError } = await supabase
    .from('searches')
    .insert([
      { url: url, plan: plan, user_id: (await supabase.auth.getUser()).data.user.id },
    ])
    .select();

  if (addError) {
    console.log(addError);
    return null;
  }

  return plan;
}

async function generatePlan(url) {
  const plan = MOCK_DATA.plan;
  return plan;
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