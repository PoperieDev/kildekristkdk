"use client";

import { useState, useEffect } from "react";
import Plan from "./Plan";
import Step from "./Step";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { createOrGetPlan } from "./Actions";

export default function App() {
  const [plan, setPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const [steps, setSteps] = useState();
  const [url, setUrl] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for URL in search params when component mounts
  useEffect(() => {
    const urlParam = searchParams.get("url");
    if (urlParam) {
      setUrl(urlParam);
      // Auto-search if URL is in params
      searchWithUrl(urlParam);
    }
  }, [searchParams]);

  async function searchWithUrl(urlToSearch) {
    setLoadingPlan(true);
    setPlan(null);
    setSteps(null);
    const plan = await createOrGetPlan(urlToSearch);
    // Add status: "pending" to each object in the plan array
    const planWithStatus = plan.map((item) => ({
      ...item,
      status: "pending",
    }));
    setLoadingPlan(false);
    setPlan(planWithStatus);
  }

  async function search() {
    // Update URL in search params
    const params = new URLSearchParams(window.location.search);
    params.set("url", url);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, "", newUrl);

    // Perform search with current URL
    searchWithUrl(url);
  }

  return (
    <div className="w-full grid">
      <p className="mb-2">Indtast kilde</p>
      <label className="input w-full pr-0 z-10 shadow-xl">
        <span className="label">URL</span>
        <input
          onSubmit={(e) => search()}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          type="text"
          placeholder="https://"
        />
        <a onClick={() => search()} className="btn btn-neutral">
          Undersøg
        </a>
      </label>
      {loadingPlan || plan !== null ? (
        <div className="w-full z-0">
          <div className="mx-auto pt-8 shadow-sm gap-4 border-t-none min-h-96 rounded-t-none card bg-base-100 w-[calc(100%-4rem)] card-border p-4">
            <div className="flex w-full flex-col gap-4">
              <Plan plan={plan} loadingPlan={loadingPlan} />
              <motion.div layout>
                <div className="divider">PROCESS</div>
                <div className="grid gap-4">
                  {steps
                    ? steps.map((step, index) => (
                      <Step key={index} stepData={step} />
                    ))
                    : null}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
