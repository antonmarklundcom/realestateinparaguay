import Link from "next/link";
import { t } from "../lib/dictionary";

export default function Home() {
  const d = t("en");

  return (
    <div className="flex flex-col flex-1">
      <header className="border-b border-black/10 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold">{d.brand}</span>
        <nav className="flex gap-6 text-sm">
          <Link href="/properties">{d.nav.properties}</Link>
          <Link href="/new-developments">{d.nav.newDevelopments}</Link>
          <Link href="/guides">{d.nav.guides}</Link>
          <Link href="/why-paraguay">{d.nav.whyParaguay}</Link>
          <Link href="/about">{d.nav.about}</Link>
          <Link href="/contact">{d.nav.contact}</Link>
        </nav>
      </header>

      {/*
        Placeholder hero — scroll-world cinematic hero (PLAN.md §7) not wired
        yet. Copy overlays here are the locked English beats from the plan;
        replace this block with the scroll-scrub engine in Phase 6.
      */}
      <main className="flex flex-col flex-1 items-center justify-center text-center px-6 py-32 gap-6">
        <h1 className="text-4xl font-semibold tracking-tight max-w-2xl">
          {d.hero.title}
        </h1>
        <p className="text-lg text-zinc-600 max-w-xl">{d.hero.subtitle}</p>
        <div className="flex gap-4">
          <Link
            href="/properties"
            className="rounded-full bg-black text-white px-6 py-3 text-sm font-medium"
          >
            {d.cta.browseProperties}
          </Link>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ""}`}
            className="rounded-full border border-black/20 px-6 py-3 text-sm font-medium"
          >
            {d.cta.whatsapp}
          </a>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 w-full max-w-4xl text-left">
          {(
            Object.keys(d.segment) as Array<keyof typeof d.segment>
          ).map((key) => (
            <div key={key} className="border border-black/10 rounded-xl p-6">
              <h2 className="font-medium mb-2">{d.segment[key]}</h2>
              <p className="text-sm text-zinc-600">
                Listings for this segment will appear here once inventory
                syncs from inmobiliaria.com.py.
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-black/10 px-6 py-8 text-sm text-zinc-500">
        {d.brand} — Asunción, Paraguay. [Contact details pending — same NAP
        as inmobiliaria.com.py]
      </footer>
    </div>
  );
}
