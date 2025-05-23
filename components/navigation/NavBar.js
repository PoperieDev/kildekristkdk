"use server";

import { createClient } from "@/utils/supabase/server";
import LogInButton from "./LogInButton";
import LogOutButton from "./LogOutButton";
import Link from "next/link";

export default async function NavBar() {
    const supabase = await createClient();
    const {
        data: { user: user },
    } = await supabase.auth.getUser();

    return (
        <>
            <div className="navbar grid place-items-center bg-base-100/50 backdrop-blur-xl z-50 shadow-sm fixed top-0 left-0">
                <div className="container navbar">
                    <div className="navbar-start">
                        <Link href="/" className="btn btn-ghost text-xl">
                            Kildekritisk.dk
                        </Link>
                        <Link href="/omos" className="btn hover:border hover:border-black/50 font-normal opacity-75">
                            Hvem er vi?
                        </Link>
                    </div>
                    <p className="opacity-50 text-nowrap">DENNE WEBSIDE ER ET SKOLEPROJEKT</p>

                    <div className="navbar-end">
                        {!user ? <LogInButton /> : <LogOutButton />}
                    </div>
                </div>
            </div>
        </>
    );
}
