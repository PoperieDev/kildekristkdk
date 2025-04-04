"use client"

import { signOut } from "./SignOut";

export default function LogOutButton() {
    return (
        <button onClick={() => { signOut() }} className="btn">Log ud</button>
    );
}