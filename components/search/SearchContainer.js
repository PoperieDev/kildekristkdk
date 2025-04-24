"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchForm from "./SearchForm";
import ResultsDisplay from "../results/ResultsDisplay";
import { createOrGetPlan } from "../actions/PlanActions";
import toast from "react-hot-toast";
import { getSteps } from "../actions/Steps";

export default function SearchContainer() {
  const [plan, setPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [steps, setSteps] = useState(null);
  const [url, setUrl] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

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

    // Get plan
    try {
      const plan = await createOrGetPlan(urlToSearch);
      if (plan.error) {
        console.log(plan.error);
        toast.error(plan.error);
        setLoadingPlan(false);
        return;
      }

      setPlan(plan);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("An error occurred during search");
    } finally {
      setLoadingPlan(false);
    }

    // Get steps
    try {
      const steps = await getSteps(urlToSearch);
      if (steps.error) {
        console.log(steps.error);
        toast.error(steps.error);
        setLoadingPlan(false);
        return;
      }

      setSteps(steps);
    } catch (error) {
      console.error("Steps error:", error);
      toast.error("An error occurred during steps");
    }
  }

  async function handleSearch() {
    searchWithUrl(url);
  }

  return (
    <div className="w-full grid">
      <SearchForm url={url} setUrl={setUrl} onSearch={handleSearch} />

      {plan && steps ? (
        <ResultsDisplay
          initialPlan={plan}
          loadingPlan={loadingPlan}
          initialSteps={steps}
          url={url}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
