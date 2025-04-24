"use server";

import { createClient } from "@/utils/supabase/server";
import LogInButton from "./LogInButton";
import LogOutButton from "./LogOutButton";

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
            <a href="/" className="btn btn-ghost text-xl">
              Kildekritisk.dk
            </a>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li>
                <a className="btn btn-ghost">Kilde tjekker</a>
              </li>
            </ul>
          </div>
          <div className="navbar-end">
            {!user ? <LogInButton /> : <LogOutButton />}
          </div>
        </div>
      </div>
    </>
  );
}
