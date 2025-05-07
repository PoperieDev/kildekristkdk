"use client";

import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export default function SearchForm() {
  return (
    <div>
      <p className="mb-2">Indtast kilde</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const url = e.target.url.value;

          var res = url.match(
            /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
          );

          if (!res) {
            toast.error("Ugyldigt URL");
            return;
          }
          redirect(`/searchv2?url=${url}`);
        }}
        className="input w-full pr-0 z-10 shadow-xl"
      >
        <span className="label">URL</span>
        <input name="url" placeholder="https://" />
        <button type="submit" className="btn btn-neutral">
          Undersøg
        </button>
      </form>
    </div>
  );
}
