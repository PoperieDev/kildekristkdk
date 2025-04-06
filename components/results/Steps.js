"use client";

import { useState } from "react";
import Step from "./Step";

export default function Steps({ initialSteps = [] }) {
  const [steps, setSteps] = useState(initialSteps);

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
