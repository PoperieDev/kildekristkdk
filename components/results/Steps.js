"use client";

import { useEffect, useState } from "react";
import Step from "./Step";
import { createClient } from "@/utils/supabase/client";

export default function Steps({ initialSteps = [], url }) {
    const [steps, setSteps] = useState(initialSteps);


    useEffect(() => {
        if (!initialSteps || !initialSteps.length) return;

        const supabase = createClient();
        if (!supabase) {
            console.error("Supabase client not available");
            return;
        }

        const subscription = supabase
            .channel(`steps-updates`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "steps",
                    filter: `url=eq.${url}`,
                },
                (payload) => {
                    const payloadId = payload.new.id;
                    const newSteps = steps.map((step) => {
                        if (step.id === payloadId) {
                            return payload.new;
                        }
                        return step;
                    });
                    setSteps(newSteps);
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [initialSteps]);

    if (!steps || steps.length === 0) {
        return null;
    }

    return (
        <div className="grid gap-4">
            {steps.map((step, index) => (
                <Step key={index} stepData={step} />
            ))}
        </div>
    );
}
