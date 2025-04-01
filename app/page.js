import { Check, CheckCircle, CheckCircle2, Loader2, X } from "lucide-react";
import Image from "next/image";

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
              <div className="grid gap-2">
                <p className="font-bold">Planlægning</p>
                <ul className="timeline timeline-vertical">
                  <li>
                    <div className="timeline-end timeline-box">Tjek sidens indhold</div>
                    <div className="timeline-middle">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="text-primary h-5 w-5">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                          clipRule="evenodd" />
                      </svg>
                    </div>
                    <hr className="bg-primary" />
                  </li>
                  <li>
                    <hr className="bg-secondary" />
                    <div className="timeline-middle">
                      <div className="size-4 m-1 p-0.5 rounded-full bg-current grid place-items-center"><Loader2 strokeWidth={3} stroke="#FFFFFF" className="size-full animate-spin" /></div>
                    </div>
                    <div className="timeline-end timeline-box">Undersøg forfattere</div>
                    <hr className="bg-secondary" />
                  </li>
                  <li>
                    <hr className="bg-secondary" />
                    <div className="timeline-end timeline-box">Step 3</div>
                    <div className="timeline-middle">
                      <div className="size-4 m-1 p-0.5 rounded-full bg-current grid place-items-center"><X strokeWidth={3} stroke="#FFFFFF" className="size-full" /></div>
                    </div>
                    <hr className="bg-secondary" />
                  </li>
                  <li>
                    <hr className="bg-secondary" />
                    <div className="timeline-middle">
                      <div className="size-4 m-1 p-0.5 rounded-full bg-current grid place-items-center"><X strokeWidth={3} stroke="#FFFFFF" className="size-full" /></div>
                    </div>
                    <div className="timeline-end timeline-box">Step 4</div>
                    <hr className="bg-secondary" />
                  </li>
                  <li>
                    <hr className="bg-secondary" />
                    <div className="timeline-end timeline-box">Step 5</div>
                    <div className="timeline-middle">
                      <div className="size-4 m-1 p-0.5 rounded-full bg-current grid place-items-center"><X strokeWidth={3} stroke="#FFFFFF" className="size-full" /></div>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex gap-2 items-center">
                <CheckCircle2 />
                <p className="font-bold">Tjek sidens indhold</p>
              </div>
              <div className="card card-border p-4 grid gap-2">
                <p className="max-w-prose">Først undersøger jeg indholdet af siden, og tjekker om det virker troværdigt.</p>
                <div className="flex gap-2 items-center opacity-75">
                  <CheckCircle2 className="size-4" />
                  <p className="text-sm">
                    Downloader sidens indhold
                  </p>
                </div>
                <div className="flex gap-2 items-center opacity-75">
                  <CheckCircle2 className="size-4" />
                  <p className="text-sm">
                    Læser indholdet igennem
                  </p>
                </div>
                <p>Indholdet på siden virker troværdigt.</p>
              </div>
              <div className="flex gap-2 items-center">
                <Loader2 className="animate-spin" />
                <p className="font-bold">Undersøg forfattere</p>
              </div>
              <div className="card card-border p-4">
                <p className="max-w-prose">Nu vil jeg se sidens indhold, for at se om jeg kan finde forfatteren.</p>
                <div className="flex gap-2 mt-2 items-center opacity-75">
                  <CheckCircle2 className="size-4" />
                  <p className="text-sm">
                    Downloader sidens indhold
                  </p>
                </div>
                <div className="flex gap-2 mt-2 items-center opacity-75">
                  <CheckCircle2 className="size-4" />
                  <p className="text-sm">
                    Søger efter forfattere
                  </p>
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
