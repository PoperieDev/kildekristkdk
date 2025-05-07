"use client";

import { Save } from "lucide-react";
import { signOut } from "./SignOut";

export default function LogOutButton() {
  return (
    <>
      <p>Dine søgninger bliver nu gemt</p>
      <Save strokeWidth={2} className="w-4 mx-2 opacity-75" />
      <button
        onClick={() => {
          signOut();
        }}
        className="btn"
      >
        Log ud
      </button>
    </>
  );
}
