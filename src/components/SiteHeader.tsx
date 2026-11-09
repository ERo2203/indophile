"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "./Logo";

const NAV = [
  { href: "/explore", label: "Explore" },
  { href: "/timeline", label: "Timeline" },
  { href: "/atlas", label: "Atlas" },
  { href: "/civilisations", label: "Civilisations" },
  { href: "/archaeology", label: "Archaeology" },
  { href: "/genetics", label: "Genetics" },
  { href: "/collections", label: "Collections" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const immersive = pathname === "/atlas";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        router.push("/search");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  useEffect(() => setOpen(false), [pathname]);

  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || immersive || open ? "bg-parchment/92 backdrop-blur-md border-b rule" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-ind flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="Indophile home" className="shrink-0 text-ink">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={`relative text-[0.86rem] tracking-wide transition-colors ${
                    active(n.href) ? "text-ink" : "text-stone hover:text-ink"
                  }`}
                >
                  {n.label}
                  {active(n.href) && <span className="absolute -bottom-[22px] left-0 right-0 h-[2px] bg-terracotta" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="group flex items-center gap-2 text-stone hover:text-ink"
            aria-label="Search (⌘K)"
          >
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="m15.5 15.5 5 5" strokeLinecap="round" />
            </svg>
            <kbd className="hidden xl:inline data text-[10px] border rule px-1.5 py-0.5 text-stone-light group-hover:text-stone">⌘K</kbd>
          </Link>
          <Link href="/about" className={`hidden sm:inline text-[0.86rem] ${active("/about") ? "text-ink" : "text-stone hover:text-ink"}`}>
            About
          </Link>
          <Link href="/reading-list" aria-label="Your reading list" className="hidden sm:flex w-8 h-8 items-center justify-center rounded-full border rule text-stone hover:text-ink hover:border-ink/40">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
              <path d="M6 3.5h12v17l-6-4-6 4z" strokeLinejoin="round" />
            </svg>
          </Link>
          <button
            className="lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px]"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className={`block h-px w-5 bg-ink transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`block h-px w-5 bg-ink transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="lg:hidden border-t rule bg-parchment">
          <ul className="container-ind py-4">
            {[...NAV, { href: "/about", label: "About" }, { href: "/reading-list", label: "Reading list" }].map((n) => (
              <li key={n.href} className="border-b rule last:border-0">
                <Link href={n.href} className="flex items-baseline justify-between py-3.5">
                  <span className="font-display text-2xl">{n.label}</span>
                  <span className="data text-stone">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
