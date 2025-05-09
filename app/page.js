import SearchForm from "@/components/v3/SearchForm";
import { createClient } from "@/utils/supabase/server";
import { CheckCircle2, X } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from("datav2")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)
        .eq("user_id", user?.id);

    return (
        <main className="">
            <div className="gap-16 w-fit my-32 flex flex-col">
                <div>
                    <h1 className="text-6xl font-bold">Undersøg din kilde</h1>
                </div>
                <div>
                    <SearchForm />
                    {data ? (
                        <div className="flex mt-8 flex-col gap-4 card card-border p-4">
                            <h2 className="font-bold">Tidligere søgninger</h2>
                            <div className="grid gap-2 text-sm">
                                {data.length < 1 && <p>Du har ingen tidligere søgninger...</p>}
                                {data.map((search, index) => (
                                    <div className="flex gap-2 items-center" key={search.url}>
                                        {search.data.result.verified ? (
                                            <CheckCircle2
                                                className="size-4 stroke-primary"
                                                strokeWidth={1.5}
                                            />
                                        ) : (
                                            <X className="size-4 stroke-error" strokeWidth={2.5} />
                                        )}
                                        <a
                                            className={
                                                "opacity-75 hover:underline p-1 px-2 rounded-full " +
                                                (search.data.result.verified
                                                    ? "bg-primary/25"
                                                    : "bg-error/25")
                                            }
                                            href={"/searchv2?url=" + search.url}
                                        >
                                            {search.url && search.url.length > 70
                                                ? search.url.substring(0, 70) + "..."
                                                : search.url}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </main>
    );
}
