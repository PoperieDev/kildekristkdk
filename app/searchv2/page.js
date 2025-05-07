"use client";

import { createSearchv2 } from "@/components/v3/actions/actions";
import { ArrowLeft, Loader2 } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import PlanV3 from "@/components/v3/Plan";
import Research from "@/components/v3/Research";
import Results from "@/components/v3/Results";
import Link from "next/link";

export default function SearchPage({ searchParams }) {
  const { url } = React.use(searchParams);

  const [loadingSearch, setLoadingSearch] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [displayedResearch, setDisplayedResearch] = useState([
    {
      isSkeletonLoader: true,
      title: "Forbereder næste undersøgelse...",
      subSteps: [],
    },
  ]);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Function to sleep for a specified amount of time
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Function to sequentially animate research steps
  const animateResearchSteps = useCallback(async (researchData) => {
    const { researchSteps, plannedSteps } = researchData;
    if (!researchSteps || researchSteps.length === 0) return;

    const updatedPlannedSteps = [...plannedSteps].map((step) => ({
      ...step,
      completed: false,
    }));

    // Process each research step sequentially
    for (let i = 0; i < researchSteps.length; i++) {
      // Remove the skeleton loader before adding the real step
      setDisplayedResearch((prev) => {
        const newResearch = [...prev];
        // Remove the skeleton loader if it's the last item
        if (
          newResearch.length > 0 &&
          newResearch[newResearch.length - 1].isSkeletonLoader
        ) {
          return newResearch.slice(0, -1);
        }
        return newResearch;
      });

      const currentStep = {
        ...researchSteps[i],
        completed: false,
        subSteps: researchSteps[i].subSteps.map((subStep) => ({
          ...subStep,
          completed: false,
        })),
      };

      // Add the research step to displayed research
      setDisplayedResearch((prev) => [...prev, currentStep]);

      // Add skeleton loader for the next step (if not the last step)
      if (i < researchSteps.length - 1) {
        setDisplayedResearch((prev) => [
          ...prev,
          {
            isSkeletonLoader: true,
            title: "Forbereder næste undersøgelse...",
            subSteps: [],
          },
        ]);
      }

      // Wait before starting to complete substeps
      await sleep(2000);

      // Process each substep sequentially
      for (let j = 0; j < currentStep.subSteps.length; j++) {
        // Mark current substep as completed
        setDisplayedResearch((prev) => {
          const newResearch = [...prev];
          // Find the current research step (accounting for skeleton loader)
          const currentIndex = newResearch.findIndex(
            (item) => !item.isSkeletonLoader && item.title === currentStep.title
          );

          if (currentIndex >= 0) {
            newResearch[currentIndex] = {
              ...newResearch[currentIndex],
              subSteps: newResearch[currentIndex].subSteps.map(
                (subStep, subIndex) =>
                  subIndex === j ? { ...subStep, completed: true } : subStep
              ),
            };
          }
          return newResearch;
        });

        // Wait between substeps
        await sleep(1500);
      }

      // Mark the research step itself as completed
      setDisplayedResearch((prev) => {
        const newResearch = [...prev];
        // Find the current research step (accounting for skeleton loader)
        const currentIndex = newResearch.findIndex(
          (item) => !item.isSkeletonLoader && item.title === currentStep.title
        );

        if (currentIndex >= 0) {
          newResearch[currentIndex] = {
            ...newResearch[currentIndex],
            completed: true,
          };
        }
        return newResearch;
      });

      // Update the corresponding plan step
      const planStepId = researchSteps[i].planStepId;
      if (
        planStepId &&
        planStepId > 0 &&
        planStepId <= updatedPlannedSteps.length
      ) {
        updatedPlannedSteps[planStepId - 1].completed = true;
        setSearchResult((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            plannedSteps: [...updatedPlannedSteps],
          };
        });
      }

      // Wait before starting next research step
      await sleep(1200);
    }

    setAnimationComplete(true);
  }, []);

  useEffect(() => {
    async function getSearch(url) {
      console.log(url);

      const searchResult = await Promise.all([
        createSearchv2(url),
        new Promise((resolve) => setTimeout(resolve, 500)), // To make sure animation at least plays slightly
      ]).then(([result]) => result);

      console.log(searchResult);

      if (searchResult.cached === true) {
        if (searchResult && searchResult.plannedSteps) {
          searchResult.plannedSteps = searchResult.plannedSteps.map((step) => ({
            ...step,
            completed: true,
          }));
        }

        if (searchResult && searchResult.researchSteps) {
          searchResult.researchSteps = searchResult.researchSteps.map(
            (step) => ({
              ...step,
              completed: true,
              subSteps: step.subSteps.map((subStep) => ({
                ...subStep,
                completed: true,
              })),
            })
          );
        }

        setSearchResult(searchResult);
        setDisplayedResearch(searchResult.researchSteps);
        setLoadingSearch(false);
        setAnimationComplete(true);

        setTimeout(() => {
          setShowResults(true);
        }, 500);

        return;
      }

      // Add completed field to each step in the plan
      if (searchResult && searchResult.plannedSteps) {
        searchResult.plannedSteps = searchResult.plannedSteps.map((step) => ({
          ...step,
          completed: false,
        }));
      }

      if (searchResult && searchResult.researchSteps) {
        searchResult.researchSteps = searchResult.researchSteps.map((step) => ({
          ...step,
          completed: false,
          subSteps: step.subSteps.map((subStep) => ({
            ...subStep,
            completed: false,
          })),
        }));
      }

      setSearchResult(searchResult);

      // Set loading to false and trigger exit animation
      setLoadingSearch(false);

      // Wait for exit animation to complete before showing results
      setTimeout(() => {
        setShowResults(true);
        // Start the animation sequence after results are shown
        if (
          searchResult &&
          searchResult.researchSteps &&
          searchResult.plannedSteps
        ) {
          setTimeout(() => {
            // Pass both research steps and planned steps directly
            animateResearchSteps({
              researchSteps: searchResult.researchSteps,
              plannedSteps: searchResult.plannedSteps,
            });
          }, searchResult.plannedSteps.length * 750);
        }
      }, 500);
    }

    getSearch(url);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loadingSearch && (
          <motion.div
            key="loader"
            className="grid place-items-center aspect-square relative"
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid place-items-center gap-4">
              <h2 className="font-bold text-4xl">
                Indlæser din undersøgelse af kilden
              </h2>
              <h1 className="text-3xl">
                {url && url.length > 30 ? url.substring(0, 30) + "..." : url}
              </h1>
            </div>
            <Loader2
              strokeWidth={4}
              className="w-2/3 h-2/3 absolute -z-10 opacity-10 animate-spin blur-lg"
            />
            <Loader2
              strokeWidth={0.5}
              className="w-2/3 h-2/3 absolute -z-10 opacity-10 animate-spin"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResults && searchResult && (
          <motion.div
            className="h-screen w-full py-32"
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-2 mb-4">
              <ArrowLeft className="w-4 opacity-75" />
              <Link href="/" className="hover:underline">
                Tilbage til hjem
              </Link>
            </div>
            <h1 className="text-4xl font-bold mb-8">
              Undersøgelse af kilden:{" "}
              {url && url.length > 30 ? url.substring(0, 30) + "..." : url}
            </h1>
            <div className="flex gap-8 h-full">
              <div className="card card-border bg-base-100 h-full w-2/3">
                <div className="card-body h-full">
                  <h2 className="card-title">Undersøgelse</h2>
                  <Research currentResearch={displayedResearch} />
                  {animationComplete && (
                    <Results results={searchResult.result} />
                  )}
                </div>
              </div>
              <div className="card card-border bg-base-100 h-full w-1/3">
                <div className="card-body h-full">
                  <h2 className="card-title">Plan</h2>
                  {searchResult.plannedSteps && (
                    <PlanV3 plan={searchResult.plannedSteps} />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
