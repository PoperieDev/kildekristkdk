import { Check, CheckCircle, CheckCircle2, Loader2, X } from "lucide-react";

export default function Plan({ plan }) {
  return (
    <div className="grid gap-2">
      <p className="font-bold">Planlægning</p>
      <ul className="timeline timeline-compact timeline-vertical">
        {plan.map((step, index) => (
          <li key={index}>
            {index !== 0 && <hr className="bg-base" />}
            <div className="timeline-end shadow-sm timeline-box">
              {step.title}
            </div>
            <div className="timeline-middle ">
              {step.status === "pending" ? (
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
            {plan.length - 1 !== index && (
              <>
                {step.status === "pending" ? (
                  <hr className="bg-base" />
                ) : (
                  <hr className="bg-primary" />
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
