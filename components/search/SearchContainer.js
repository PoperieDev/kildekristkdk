"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SearchForm from "./SearchForm";
import ResultsDisplay from "../results/ResultsDisplay";
import { createOrGetPlan } from "../actions/PlanActions";
import toast from "react-hot-toast";

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

    try {
      const plan = await createOrGetPlan(urlToSearch);
      if (plan.error) {
        console.log(plan.error);
        toast.error(plan.error);
        setLoadingPlan(false);
        return;
      }

      // Add status: "pending" to each object in the plan array
      const planWithStatus = plan.map((item) => ({
        ...item,
        status: "pending",
      }));

      setPlan(planWithStatus);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("An error occurred during search");
    } finally {
      setLoadingPlan(false);
    }
  }

  async function handleSearch() {
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
      <SearchForm url={url} setUrl={setUrl} onSearch={handleSearch} />

      {plan && (
        <ResultsDisplay plan={plan} loadingPlan={loadingPlan} steps={steps} />
      )}
    </div>
  );
}
