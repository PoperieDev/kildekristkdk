"use client";

import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Clipboard, Loader2, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, when: "beforeChildren" },
  },
};

const headerVariants = {
  hidden: { opacity: 0, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, delay: 0, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -20, filter: "blur(10px)" },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: "easeOut",
      delay: index * 0.15,
    },
  }),
};

export default function Plan({ initialPlan, loadingPlan, url }) {
  const [plan, setPlan] = useState(initialPlan);

  useEffect(() => {
    if (!initialPlan || !initialPlan.length) return;

    const supabase = createClient();
    if (!supabase) {
      console.error("Supabase client not available");
      return;
    }

    const subscription = supabase
      .channel(`plan-updates`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "searches",
          filter: `url=eq.${url}`,
        },
        (payload) => {
          setPlan(payload.new.plan);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [initialPlan]);

  return (
    <motion.div
      layout
      className="grid gap-2"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.ul
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="timeline timeline-compact timeline-vertical overflow-hidden"
      >
        <AnimatePresence>
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex gap-2 mb-2 items-center"
            variants={headerVariants}
          >
            <Clipboard strokeWidth={1.5} />
            <p className="font-bold text-xl">Planlægning</p>
          </motion.div>

          {plan.map((step, index) => (
            <PlanStep
              key={step.title + index}
              step={step}
              index={index}
              isLast={index === plan.length - 1}
              previousStepPending={
                index > 0 ? plan[index - 1].status === "pending" : false
              }
            />
          ))}
        </AnimatePresence>
      </motion.ul>
    </motion.div>
  );
}

function PlanStep({ step, index, isLast, previousStepPending }) {
  const isPending = step.status === "pending";

  return (
    <motion.li
      custom={index}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      variants={itemVariants}
      layout
    >
      {index !== 0 && <hr className={isPending ? "bg-base" : "bg-primary"} />}

      <div
        className={`${
          isPending ? "" : "bg-primary/20"
        } timeline-end shadow-sm timeline-box`}
      >
        {step.title}
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

      {!isLast && <hr className={isPending ? "bg-base" : "bg-primary"} />}
    </motion.li>
  );
}
