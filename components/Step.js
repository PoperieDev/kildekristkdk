import { CheckCircle2 } from "lucide-react";

export default function Step({ stepData }) {
  return (
    <div className="grid gap-2">
      <div className="flex gap-2 items-center">
        <CheckCircle2 />
        <p className="font-bold">{stepData.title}</p>
      </div>
      <div className="card card-border p-4 grid gap-2 shadow-sm text-primary-content/50 text-sm">
        <p className="max-w-prose">
          Først undersøger jeg indholdet af siden, og tjekker om det virker
          troværdigt.
        </p>
        <div className="flex gap-2 items-center">
          <CheckCircle2 className="size-4" />
          <p className="">Downloader sidens indhold</p>
        </div>
        <div className="flex gap-2 items-center">
          <CheckCircle2 className="size-4" />
          <p className="">Læser indholdet igennem</p>
        </div>
        <p className=" text-primary">Indholdet på siden virker troværdigt.</p>
      </div>
    </div>
  );
}
