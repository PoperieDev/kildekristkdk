import Plan from "@/components/Plan";
import Step from "@/components/Step";
import { Check, CheckCircle, CheckCircle2, Loader2, X } from "lucide-react";
import Image from "next/image";

const MOCK_STEPS = [{ title: "Tjek sidens indhold", status: "done" }];
const MOCK_PLAN = [
  { title: "Tjek sidens indhold", status: "done" },
  { title: "Undersøg forfattere", status: "pending" },
  { title: "Step 3", status: "pending" },
  { title: "Step 4", status: "pending" },
  { title: "Step 5", status: "pending" },
];

export default function Home() {
  return (
    <main className="w-full min-h-screen my-32 grid place-items-center">
      <div className="gap-16 grid place-items-center">
        <div>
          <h1 className="text-6xl font-bold">Undersøg din kilde</h1>
        </div>

        <div className="w-full grid">
          <p className="mb-2">Indtast kilde</p>
          <label className="input w-full pr-0 z-10">
            <span className="label">URL</span>
            <input type="text" placeholder="URL" />
            <a className="btn btn-neutral">Undersøg</a>
          </label>
          <div className="w-full">
            <div className="mx-auto gap-2 border-t-none min-h-96 rounded-t-none card bg-base-100 w-[calc(100%-4rem)] card-border p-4">
              <Plan plan={MOCK_PLAN} />
              <Step stepData={MOCK_STEPS[0]} />
              <div className="flex gap-2 items-center">
                <Loader2 className="animate-spin" />
                <p className="font-bold">Undersøg forfattere</p>
              </div>
              <div className="card card-border p-4">
                <p className="max-w-prose">
                  Nu vil jeg se sidens indhold, for at se om jeg kan finde
                  forfatteren.
                </p>
                <div className="flex gap-2 mt-2 items-center opacity-75">
                  <CheckCircle2 className="size-4" />
                  <p className="text-sm">Downloader sidens indhold</p>
                </div>
                <div className="flex gap-2 mt-2 items-center opacity-75">
                  <CheckCircle2 className="size-4" />
                  <p className="text-sm">Søger efter forfattere</p>
                </div>
                <div className="flex gap-2 mt-2 items-center opacity-75">
                  <Loader2 className="size-4 animate-spin" />
                  <p className="text-sm">
                    Søger efter informationer på forfatteren
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
