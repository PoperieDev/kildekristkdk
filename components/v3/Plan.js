"use client";

import { CheckCircle2, Loader2, X } from "lucide-react";
import { motion } from "framer-motion";

export default function PlanV3({ plan }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, filter: "blur(10px)" },
    show: { opacity: 1, filter: "blur(0px)" },
  };

  return (
    <div className="grid gap-2">
      <motion.ul
        className="timeline timeline-compact timeline-vertical"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {plan.map((step, index) => {
          const isCompleted = step.completed === true;
          const isSuccess = step.success !== undefined ? step.success : true;
          const previousStepPending =
            index > 0 ? plan[index - 1].completed === false : false;
          const isLast = index === plan.length - 1;

          return (
            <motion.li
              key={step.id}
              variants={item}
              transition={{ duration: 0.5 }}
            >
              {index !== 0 && (
                <hr
                  className={
                    isCompleted
                      ? isSuccess
                        ? "bg-primary"
                        : "bg-error"
                      : "bg-base"
                  }
                />
              )}

              <div
                className={`${
                  isCompleted
                    ? isSuccess
                      ? "bg-primary/20"
                      : "bg-error/20"
                    : ""
                } timeline-end shadow-sm timeline-box`}
              >
                {step.title}
              </div>

              <div className="timeline-middle">
                {!isCompleted && previousStepPending ? (
                  <div className="size-4 m-1 p-0.5 rounded-full bg-current grid place-items-center">
                    <div className="size-full bg-current animate-ping rounded-full" />
                  </div>
                ) : !isCompleted ? (
                  <div className="size-4 m-1 p-0.5 rounded-full bg-current grid place-items-center">
                    <Loader2
                      strokeWidth={3}
                      stroke="#FFFFFF"
                      className="size-full animate-spin"
                    />
                  </div>
                ) : isSuccess ? (
                  <div className="size-4 m-1 p-0.5 rounded-full bg-primary grid place-items-center">
                    <CheckCircle2
                      strokeWidth={3}
                      stroke="#FFFFFF"
                      className="size-full"
                    />
                  </div>
                ) : (
                  <div className="size-4 m-1 p-0.5 rounded-full bg-error grid place-items-center">
                    <X strokeWidth={3} stroke="#FFFFFF" className="size-full" />
                  </div>
                )}
              </div>

              {!isLast && (
                <hr
                  className={
                    isCompleted
                      ? isSuccess
                        ? "bg-primary"
                        : "bg-error"
                      : "bg-base"
                  }
                />
              )}
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}
