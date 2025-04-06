"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import React from "react";

export default function Step({ stepData }) {
  const { title, status, description, steps = [], finish_text } = stepData;
  const isDone = status === "done";

  return (
    <div className="grid gap-2">
      <div className="flex gap-2 items-center">
        {isDone ? (
          <CheckCircle2 className="stroke-primary" strokeWidth={1.5} />
        ) : (
          <Loader2 strokeWidth={1.5} className="animate-spin" />
        )}
        <p className={`font-bold ${isDone ? "text-primary" : ""}`}>{title}</p>
      </div>

      <div className="card card-border p-4 grid gap-2 shadow-sm text-primary-content/50 text-sm">
        <p className="max-w-prose">{description}</p>

        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex gap-2 items-center">
              {step.status === "done" ? (
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
            </div>
          </React.Fragment>
        ))}

        {finish_text && <p className="mt-2 font-medium">{finish_text}</p>}
      </div>
    </div>
  );
}
