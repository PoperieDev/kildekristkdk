"use client"

import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

export default function SignInPage() {
    useEffect(() => {
        createClient().auth.signInWithOAuth(
            { provider: 'google', options: { redirectTo: `http://localhost:3000/auth/callback`, } }
        );
    }, []);
}