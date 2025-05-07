"use client";

import { CheckCircle2, Loader2, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function Research({ currentResearch }) {
  const containerRef = useRef(null);

  // Auto-scroll to bottom when new items are added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentResearch]);

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

  if (!currentResearch || currentResearch.length === 0) {
    return null;
  }

  return (
    <motion.div
      ref={containerRef}
      className="grid gap-4 overflow-y-auto max-h-[calc(100vh-250px)]"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {currentResearch.map((research, index) =>
        research.isSkeletonLoader ? (
          <SkeletonLoader
            key={`skeleton-${index}`}
            variants={item}
            title={research.title}
          />
        ) : (
          <ResearchItem key={index} research={research} variants={item} />
        )
      )}
    </motion.div>
  );
}

function ResearchItem({ research, variants }) {
  // Use the completed field directly if available, fallback to conclusion check
  const isCompleted =
    research.completed !== undefined
      ? research.completed
      : research.conclusion && research.conclusion.result;

  // Use the success field directly if available, fallback to verified check
  const isSuccess =
    research.success !== undefined
      ? research.success
      : research.conclusion && research.conclusion.verified === true;

  const subContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const subItem = {
    hidden: { opacity: 0, filter: "blur(10px)" },
    show: { opacity: 1, filter: "blur(0px)" },
  };

  return (
    <motion.div
      variants={variants}
      transition={{ duration: 0.5 }}
      className="grid gap-2"
    >
      <div className="flex gap-2 items-center">
        {isCompleted ? (
          isSuccess ? (
            <CheckCircle2 className="stroke-primary size-4" strokeWidth={1.5} />
          ) : (
            <X className="stroke-error size-4" strokeWidth={2.5} />
          )
        ) : (
          <Loader2 strokeWidth={1.5} className="animate-spin size-4" />
        )}
        <p
          className={`font-bold ${
            isCompleted && isSuccess
              ? "text-primary"
              : isCompleted && !isSuccess
              ? "text-error"
              : ""
          }`}
        >
          {research.title}
        </p>
      </div>

      <div className="card card-border p-4 flex flex-col gap-2 text-primary-content/50 text-sm">
        {research.subSteps && research.subSteps.length > 0 && (
          <motion.div
            className="mt-2"
            variants={subContainer}
            initial="hidden"
            animate="show"
          >
            {research.subSteps.map((step, index) => (
              <SubStep key={index} step={step} variants={subItem} />
            ))}
          </motion.div>
        )}

        {isCompleted && research.conclusion && research.conclusion.result && (
          <motion.p
            className="mt-2 font-medium"
            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5 }}
          >
            {research.conclusion.result}
          </motion.p>
        )}
        {isCompleted &&
          research.conclusion &&
          research.conclusion.description && (
            <motion.p
              className="max-w-prose"
              initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {research.conclusion.description}
            </motion.p>
          )}
      </div>
    </motion.div>
  );
}

function SubStep({ step, variants }) {
  // Check the completed field first, then fall back to success if completed isn't defined
  const isCompleted =
    step.completed !== undefined ? step.completed : !!step.success;
  const isSuccess = step.success !== undefined ? step.success : false;

  return (
    <motion.div
      variants={variants}
      transition={{ duration: 0.3 }}
      className="flex gap-2 items-center py-1"
    >
      {isCompleted ? (
        isSuccess ? (
          <>
            <CheckCircle2 className="size-4 stroke-primary" strokeWidth={1.5} />
            <p>{step.action}</p>
          </>
        ) : (
          <>
            <X className="size-4 stroke-error" strokeWidth={2.5} />
            <p>{step.action}</p>
          </>
        )
      ) : (
        <>
          <Loader2 className="size-4 animate-spin" />
          <p className="text-sm">{step.action}</p>
        </>
      )}
    </motion.div>
  );
}

function SkeletonLoader({ variants, title }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      transition={{
        duration: 0.5,
        delay: 1,
        opacity: { duration: 0.3, delay: 1 },
        y: { type: "spring", stiffness: 100, damping: 10, delay: 1 },
        height: { duration: 0.4, delay: 1 },
      }}
      className="grid gap-2 origin-top"
    >
      <div className="flex gap-2 items-center">
        <div className="animate-pulse">
          <Loader2 strokeWidth={1.5} className="animate-spin size-4" />
        </div>
        <p className="font-bold">{title || "Forbereder..."}</p>
      </div>

      <div className="card card-border p-4 flex flex-col gap-2 text-primary-content/50 text-sm">
        <div className="animate-pulse space-y-2">
          <div className="h-3 bg-gray-300/20 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300/20 rounded"></div>
          <div className="h-3 bg-gray-300/20 rounded w-1/2"></div>
        </div>
      </div>
    </motion.div>
  );
}
