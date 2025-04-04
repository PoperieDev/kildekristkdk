import App from "@/components/App";

const MOCK_STEPS = [
  {
    title: "Tjek sidens indhold",
    status: "done",
    description:
      "Først undersøger jeg indholdet af siden, og tjekker om det virker troværdigt.",
    steps: [
      { title: "Downloader sidens indhold", status: "done" },
      { title: "Læser indholdet igennem", status: "done" },
    ],
    finish_text: "Indholdet på siden virker troværdigt.",
  },
  {
    title: "Undersøg forfattere",
    status: "pending",
    description:
      "Nu vil jeg se sidens indhold, for at se om jeg kan finde forfatteren.",
    steps: [
      { title: "Downloader sidens indhold", status: "done" },
      { title: "Søger efter forfattere", status: "done" },
      { title: "Søger efter informationer på forfatteren", status: "pending" },
    ],
    finish_text: "",
  },
];

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
