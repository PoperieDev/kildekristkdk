"use client";

import { createClient } from "@/utils/supabase/client";

export default function LogInButton() {
  return (
    <button
      onClick={() => {
        createClient().auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: `http://localhost:3000/auth/callback` },
        });
      }}
      className="btn"
    >
      Log ind
    </button>
  );
}
