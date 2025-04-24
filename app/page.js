import SearchForm from "@/components/v2/SearchForm";
import { redirect } from "next/navigation";

export default async function Home() {
  return (
    <main className="">
      <div className="gap-16 w-fit flex flex-col">
        <div>
          <h1 className="text-6xl font-bold">Undersøg din kilde</h1>
        </div>
        <SearchForm />
      </div>
    </main>
  );
}
