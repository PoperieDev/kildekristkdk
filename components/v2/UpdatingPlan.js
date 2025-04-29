"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function UpdatingPlan({ url, initialSteps }) {
    const [steps, setSteps] = useState(initialSteps);

    useEffect(() => {
        const supabase = createClient();
        if (!supabase) {
            console.error("Supabase client not available");
            return;
        }

        const subscription = supabase
            .channel(`plansteps-updates`)
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "plansteps" },
                (payload) => {
                    if (payload.new.searchurl === url) {
                        setSteps((prev) => [...prev, payload.new]);
                    }
                }
            )
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "plansteps" },
                (payload) => {
                    if (payload.new.searchurl === url) {
                        setSteps((prev) =>
                            prev.map((step) =>
                                step.id === payload.new.id ? payload.new : step
                            )
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [url]);

    return (
        <div className="grid gap-2">
            <ul className="timeline timeline-compact timeline-vertical">
                {steps.map((step, index) => {
                    const isPending = step.completed === false;
                    const previousStepPending =
                        index > 0 ? steps[index - 1].completed === false : false;
                    const isLast = index === steps.length - 1;

                    return (
                        <motion.li key={step.id} initial={{ filter: "blur(8px)" }} animate={{ filter: "blur(0px)" }} transition={{ duration: 0.3 }}>
                            {index !== 0 && (
                                <hr className={isPending ? "bg-base" : "bg-primary"} />
                            )}

                            <div
                                className={`${isPending ? "" : "bg-primary/20"
                                    } timeline-end shadow-sm timeline-box`}
                            >
                                {step.text}
                            </div>

                            <div className="timeline-middle">
                                {isPending && previousStepPending ? (
                                    <div className="size-4 m-1 p-0.5 rounded-full bg-current grid place-items-center">
                                        <div className="size-full bg-current animate-ping rounded-full" />
                                    </div>
                                ) : isPending ? (
                                    <div className="size-4 m-1 p-0.5 rounded-full bg-current grid place-items-center">
                                        <Loader2
                                            strokeWidth={3}
                                            stroke="#FFFFFF"
                                            className="size-full animate-spin"
                                        />
                                    </div>
                                ) : (
                                    <div className="size-4 m-1 p-0.5 rounded-full bg-primary grid place-items-center">
                                        <CheckCircle2
                                            strokeWidth={3}
                                            stroke="#FFFFFF"
                                            className="size-full"
                                        />
                                    </div>
                                )}
                            </div>

                            {!isLast && (
                                <hr className={isPending ? "bg-base" : "bg-primary"} />
                            )}
                        </motion.li>
                    );
                })}
            </ul>
        </div>
    );
}
