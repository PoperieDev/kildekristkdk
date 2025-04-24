"use client";

import { motion } from "framer-motion";
import Plan from "./Plan";
import Steps from "./Steps";

export default function ResultsDisplay({
  initialPlan,
  loadingPlan,
  initialSteps,
  url,
}) {
  if (!initialPlan) return null;

  return (
    <div className="w-full z-0">
      <div className="mx-auto pt-8 shadow-sm gap-4 border-t-none min-h-96 rounded-t-none card bg-base-100 w-[calc(100%-4rem)] card-border p-4">
        <div className="flex w-full flex-col gap-4">
          <Plan url={url} initialPlan={initialPlan} loadingPlan={loadingPlan} />
          <motion.div layout>
            <div className="divider">PROCESS</div>
            <Steps initialSteps={initialSteps} url={url} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
