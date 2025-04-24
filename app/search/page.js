import UpdatingPlan from "@/components/v2/UpdatingPlan";
import UpdatingResearch from "@/components/v2/UpdatingResearch";
import UpdatingResults from "@/components/v2/UpdatingResults";
import { createClient } from "@/utils/supabase/server";

export default async function SearchPage({ searchParams }) {
  const { url } = await searchParams;

  const supabase = await createClient();
  const { data: initialSteps, error } = await supabase
    .from("plansteps")
    .select("*")
    .eq("searchurl", url)
    .order("id", { ascending: true });

  const { data: initialResearch, error: researchError } = await supabase
    .from("research")
    .select("*")
    .eq("searchurl", url)
    .order("id", { ascending: true });

  if (researchError) {
    console.error(researchError);
  }

  const { data: initialResearchSteps, error: researchStepsError } =
    await supabase.from("researchsteps").select("*").eq("searchurl", url);

  if (researchStepsError) {
    console.error(researchStepsError);
  }

  const { data: initialResults, error: resultsError } = await supabase
    .from("results")
    .select("*")
    .eq("searchurl", url)
    .order("id", { ascending: true })
    .limit(1);

  if (resultsError) {
    console.error(resultsError);
  }

  if (error) {
    console.error(error);
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="h-screen w-full py-32">
        <h1 className="text-4xl font-bold mb-8">
          Undersøgelse af kilden: {url.split("//")[1].split("/")[0]}
        </h1>
        <div className="flex gap-8 h-full">
          <div className="card card-border bg-base-100 h-full w-2/3">
            <div className="card-body h-full">
              <h2 className="card-title">Undersøgelse</h2>
              <UpdatingResearch
                initialResearch={initialResearch}
                initialSteps={initialResearchSteps}
                searchUrl={url}
              />
              <UpdatingResults initialResults={initialResults[0]} url={url} />
            </div>
          </div>
          <div className="card card-border bg-base-100 h-full w-1/3">
            <div className="card-body h-full">
              <h2 className="card-title">Plan</h2>
              <UpdatingPlan url={url} initialSteps={initialSteps} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
