import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { assertPublishedValid } from "@/lib/validate";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"] });
const plex = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: { default: "Indophile — Discover the stories beneath our civilisation", template: "%s · Indophile" },
  description:
    "An interactive historical atlas of the Indian subcontinent: archaeology, archaeogenetics, kingdoms, scripts and trade, connected in one evidence-driven knowledge base.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Unsupported published claims break the build, not just the dashboard.
  if (process.env.NODE_ENV === "production") assertPublishedValid();
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${plex.variable}`}>
      <body className="min-h-screen flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] bg-ink text-ivory px-3 py-2">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1 min-w-0 w-full">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
