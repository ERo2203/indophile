import type { ImageRef } from "@/lib/types";
import { Plate } from "./ui";

export function PageHero({ eyebrow, title, intro, image, children }: { eyebrow: string; title: React.ReactNode; intro?: string; image?: ImageRef; children?: React.ReactNode }) {
  return (
    <header className="container-ind pt-14 pb-14">
      <div className={`grid gap-12 ${image ? "lg:grid-cols-[1.2fr_1fr] items-end" : ""}`}>
        <div className="max-w-3xl">
          <p className="rubric">{eyebrow}</p>
          <h1 className="display mt-5 !text-[clamp(2.6rem,6vw,5.5rem)]">{title}</h1>
          {intro && <p className="lede mt-6 text-ink/75">{intro}</p>}
          {children}
        </div>
        {image && <Plate image={image} aspect="aspect-[4/3]" priority />}
      </div>
    </header>
  );
}
