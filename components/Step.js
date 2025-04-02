import { CheckCircle2, Loader2 } from "lucide-react";
import React from "react";

export default function Step({ stepData }) {
  return (
    <div className="grid gap-2">
      {stepData.status === "done" ? (
        <div className="flex gap-2 items-center">
          <CheckCircle2 className=" stroke-primary" strokeWidth={1.5} />
          <p className="font-bold text-primary">{stepData.title}</p>
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <Loader2 strokeWidth={1.5} className="animate-spin" />
          <p className="font-bold">{stepData.title}</p>
        </div>
      )}
      <div className="card card-border p-4 grid gap-2 shadow-sm text-primary-content/50 text-sm">
        <p className="max-w-prose">{stepData.description}</p>
        {stepData.steps.map((step, index) => (
          <React.Fragment key={index}>
            {step.status === "done" ? (
              <div className="flex gap-2 items-center">
                <CheckCircle2 className="size-4" />
                <p className="">{step.title}</p>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <Loader2 className="size-4 animate-spin" />
                <p className="text-sm">
                  Søger efter informationer på forfatteren
                </p>
              </div>
            )}
          </React.Fragment>
        ))}
        {stepData.finish_text && (
          <p className="">Indholdet på siden virker troværdigt.</p>
        )}
      </div>
    </div>
  );
}
