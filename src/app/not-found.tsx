import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-ind py-28 min-h-[60vh]">
      <p className="rubric">404 · Unexcavated</p>
      <h1 className="display mt-5 !text-[clamp(2.6rem,6vw,5rem)]">This layer hasn&apos;t been dug yet.</h1>
      <p className="lede mt-6 text-ink/70 max-w-xl">The page you were looking for doesn&apos;t exist, or the entry hasn&apos;t been published.</p>
      <div className="mt-10 flex gap-6">
        <Link href="/search" className="bg-ink text-parchment px-5 py-3 text-sm hover:bg-terracotta">Search the archive</Link>
        <Link href="/" className="px-5 py-3 text-sm border rule hover:border-ink">Home</Link>
      </div>
    </div>
  );
}
