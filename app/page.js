import App from "@/components/App";

export default function Home() {
  return (
    <main className="w-full min-h-screen my-48 flex justify-center">
      <div className="gap-16 w-fit flex flex-col">
        <div>
          <h1 className="text-6xl font-bold">Undersøg din kilde</h1>
        </div>
        <App />
      </div>
    </main>
  );
}
