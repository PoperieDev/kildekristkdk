"use client";

import { createClient } from "@/utils/supabase/client";
import { ArrowRight, ArrowRightFromLine } from "lucide-react";

export default function LogInButton() {
  return (
    <>
      <p>Log ind for at gemme dine søgninger</p>
      <ArrowRight strokeWidth={2} className="w-4 mx-2 opacity-75" />
      <button
        onClick={() => {
          createClient().auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: process.env.URL,
            },
          });
        }}
        className="btn"
      >
        Log ind
      </button>
    </>
  );
}
