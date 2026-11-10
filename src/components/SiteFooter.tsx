import Link from "next/link";
import { Wordmark } from "./Logo";

const COLS: { title: string; links: [string, string][] }[] = [
  { title: "Explore", links: [["/deep-time", "Deep Time"], ["/timeline", "Timeline"], ["/atlas", "Historical Atlas"], ["/civilisations", "Civilisations & Polities"], ["/archaeology", "Archaeology"], ["/genetics", "Ancient DNA"]] },
  { title: "Knowledge", links: [["/languages", "Languages & Scripts"], ["/architecture", "Architecture & Material Culture"], ["/trade", "Trade & Migration"], ["/people", "Personalities"], ["/collections", "Collections"]] },
  { title: "Integrity", links: [["/methodology", "Editorial standards"], ["/sources", "Sources & bibliography"], ["/about", "About Indophile"], ["/admin", "Editorial dashboard"]] },
];

export function SiteFooter() {
  return (
    <footer className="bg-night text-paper/80 mt-0">
      <div className="container-ind py-16 grid gap-12 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <Link href="/" className="text-paper"><Wordmark /></Link>
          <p className="mt-6 font-display text-2xl leading-snug text-paper">
            Explore the history of a civilisation through the evidence it left behind.
          </p>
          <p className="mt-6 text-sm text-paper/55 leading-relaxed">
            Covering present-day India, Pakistan, Bangladesh, Nepal, Bhutan, Sri Lanka and the Maldives, with historical connections to Afghanistan and Central Asia. Modern borders are shown for orientation only.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
          {COLS.map((col) => (
            <div key={col.title}>
              <h2 className="eyebrow !text-gold mb-4">{col.title}</h2>
              <ul className="space-y-2.5">
                {col.links.map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-paper/75 hover:text-paper link-ind">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="container-ind py-6 flex flex-col sm:flex-row gap-3 justify-between data text-paper/45">
          <span>Photographs: Wikimedia Commons contributors, credited on each plate under their stated licences.</span>
          <span>Seed dataset · pending editorial verification</span>
        </div>
      </div>
    </footer>
  );
}
