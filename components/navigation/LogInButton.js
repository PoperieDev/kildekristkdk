"use client";

import { createClient } from "@/utils/supabase/client";

export default function LogInButton() {
    return (
        <button
            onClick={() => {
                createClient().auth.signInWithOAuth({
                    provider: "google",
                    options: { redirectTo: `https://www.kildekritisk.dk/auth/callback` },
                });
            }}
            className="btn"
        >
            Log ind
        </button>
    );
}
