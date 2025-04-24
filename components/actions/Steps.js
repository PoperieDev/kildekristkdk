"use server";

import { createClient } from "@/utils/supabase/server";

export async function getSteps(url) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("steps")
    .select("*")
    .eq("url", url);

  if (error) {
    return { error: "Database fejl" };
  }

  if (data) {
    return data;
  }

  return null;
}
