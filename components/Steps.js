import { useState } from "react";
import Step from "./Step";

export default function Steps({ initialSteps = [] }) {
  const [steps, setSteps] = useState(initialSteps);

  return (
    <div className="grid gap-4">
      {steps
        ? steps.map((step, index) => <Step key={index} stepData={step} />)
        : null}
    </div>
  );
}

const MOCK_STEPS = [
  {
    title: "Tjek sidens indhold",
    status: "done",
    description:
      "Først undersøger jeg indholdet af siden, og tjekker om det virker troværdigt.",
    steps: [
      { title: "Downloader sidens indhold", status: "done" },
      { title: "Læser indholdet igennem", status: "done" },
    ],
    finish_text: "Indholdet på siden virker troværdigt.",
  },
  {
    title: "Undersøg forfattere",
    status: "pending",
    description:
      "Nu vil jeg se sidens indhold, for at se om jeg kan finde forfatteren.",
    steps: [
      { title: "Downloader sidens indhold", status: "done" },
      { title: "Søger efter forfattere", status: "done" },
      { title: "Søger efter informationer på forfatteren", status: "done" },
    ],
    finish_text: "",
  },
];
