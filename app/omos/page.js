import Image from "next/image";
import Link from "next/link";

export default function OmosPage() {
  return (
    <main className="min-h-screen w-full px-16 py-32 grid grid-cols-2">
      <div>
        <h1 className="text-6xl">Om os</h1>

        <p className="mt-6">
          Vi er PoperieDev A/S, en uafhængig, statshyret organisation dedikeret til at styrke gymnasieelevers kildekritiske evner.
        </p>

        <p className="mt-4 text-base leading-relaxed">
          Vores mission er at gøre troværdig information let tilgængelig og skabe større digital forståelse.
          Gennem vores specialudviklede værktøj kan elever nemt analysere, verificere og sammenligne kilder — helt uden reklamer eller abonnementsomkostninger.
        </p>

        <p className="mt-4 text-base leading-relaxed">
          Vi tror på, at klar og åben viden er fundamentet for kritisk tænkning. Derfor prioriterer vi:
        </p>
        <ul className="list-disc list-inside mt-2 text-base">
          <li>Præcise og objektive vurderingskriterier</li>
          <li>Brugervenligt interface med trin-for-trin-vejledning</li>
          <li>Gratis adgang for alle gymnasieelever i Danmark</li>
        </ul>

        <p className="mt-4 text-base leading-relaxed">
          Bag værktøjet står et team af erfarne programmører, journalister og pædagogiske konsulenter, som løbende udvikler og opdaterer platformen i tæt dialog med brugerne.
        </p>

        <p className="mt-4 text-base">
          Har du spørgsmål eller brug for support? Kontakt os gerne via vores hjemmeside:&nbsp;
          <a
            href="https://poperie.dk/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-600"
          >
            poperie.dk
          </a>
          .
        </p>
      </div>

      <Image src={"/cumshot.jpg"} width={1080} height={1080} alt="buisnesnt metaing" className="rounded-xl border" />
    </main>
  )
}