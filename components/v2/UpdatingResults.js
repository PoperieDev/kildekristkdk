"use client";

import { createClient } from "@/utils/supabase/client";
import { CheckCircle2, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function UpdatingResults({ initialResults, url }) {
  if (!initialResults) {
    return <></>;
  }

  const [results, setResults] = useState(initialResults);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      console.error("Supabase client not available");
      return;
    }

    const subscription = supabase
      .channel(`results-updates`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "results" },
        (payload) => {
          if (payload.new.searchurl === url) {
            setResults(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [url]);

  return (
    <div className="flex flex-col gap-4 card card-border text-center justify-center items-center">
      <div className="card-body">
        <h1 className="text-2xl font-bold">{results.title}</h1>
        {results.verified ? (
          <>
            <CheckCircle2 className="mx-auto text-green-600 size-32 bg-green-100 rounded-full p-4" />
          </>
        ) : (
          <>
            <X className="mx-auto text-red-600 size-32 bg-red-100 rounded-full p-4" />
          </>
        )}
        <p>{results.description}</p>
      </div>
    </div>
  );
}
