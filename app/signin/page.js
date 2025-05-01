"use client"

import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";

export default function SignInPage() {
    useEffect(() => {
        createClient().auth.signInWithOAuth(
            { provider: 'google', options: { redirectTo: `https://www.kildekritisk.dk/auth/callback`, } }
        );
    }, []);
}