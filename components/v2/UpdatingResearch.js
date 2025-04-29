"use client";

import { createClient } from "@/utils/supabase/client";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function UpdatingResearch({
    initialResearch,
    initialSteps,
    searchUrl,
}) {
    const [research, setResearch] = useState(initialResearch);
    const [steps, setSteps] = useState(initialSteps);
    const containerRef = useRef(null);

    useEffect(() => {
        const supabase = createClient();
        if (!supabase) {
            console.error("Supabase client not available");
            return;
        }

        const subscription = supabase
            .channel(`research-updates`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "research",
                    filter: `searchurl=eq.${searchUrl}`,
                },
                (payload) => {
                    setResearch((prev) => [...prev, payload.new]);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "research",
                    filter: `searchurl=eq.${searchUrl}`,
                },
                (payload) => {
                    setResearch((prev) =>
                        prev.map((r) => (r.id === payload.new.id ? payload.new : r))
                    );
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "researchsteps",
                    filter: `searchurl=eq.${searchUrl}`,
                },
                (payload) => {
                    setSteps((prev) =>
                        prev.map((s) => (s.id === payload.new.id ? payload.new : s))
                    );
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "researchsteps",
                    filter: `searchurl=eq.${searchUrl}`,
                },
                (payload) => {
                    setSteps((prev) => [...prev, payload.new]);
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [searchUrl]);

    // Auto-scroll to bottom when research or steps change
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [research, steps]);

    return (
        <>
            {!research || research.length === 0 ? null : (
                <div ref={containerRef} className="grid gap-2 overflow-y-auto">
                    {research.map((research, index) => (
                        <Research key={index} research={research} steps={steps} />
                    ))}
                </div>
            )}
        </>
    );
}

function Research({ research, steps }) {
    return (
        <motion.div initial={{ filter: "blur(8px)" }} animate={{ filter: "blur(0px)" }} transition={{ duration: 0.3 }} className="grid gap-2">
            <div className="flex gap-2 items-center">
                {research.completed ? (
                    research.success === false ? (
                        <X className="stroke-error size-4" strokeWidth={2.5} />
                    ) : (
                        <CheckCircle2 className="stroke-primary size-4" strokeWidth={1.5} />
                    )
                ) : (
                    <Loader2 strokeWidth={1.5} className="animate-spin size-4" />
                )}
                <p
                    className={`font-bold ${research.completed && research.success !== false
                        ? "text-primary"
                        : research.completed && research.success === false
                            ? "text-error"
                            : ""
                        }`}
                >
                    {research.title}
                </p>
            </div>

            <div className="card card-border p-4 flex flex-col gap-2  text-primary-content/50 text-sm">
                <p className="max-w-prose">{research.description}</p>

                {!steps || steps.length === 0
                    ? null
                    : steps
                        .filter((step) => step.researchid === research.id)
                        .map((step, index) => <ResearchStep key={index} step={step} />)}

                {research.result && (
                    <p className="mt-2 font-medium">{research.result}</p>
                )}
            </div>
        </motion.div>
    );
}

function ResearchStep({ step }) {
    return (
        <motion.div initial={{ filter: "blur(8px)" }} animate={{ filter: "blur(0px)" }} transition={{ duration: 0.3 }} className="flex gap-2 items-center">
            {step.completed ? (
                <>
                    <CheckCircle2 className="size-4" />
                    <p>{step.title}</p>
                </>
            ) : (
                <>
                    <Loader2 className="size-4 animate-spin" />
                    <p className="text-sm">{step.title}</p>
                </>
            )}
        </motion.div>
    );
}
