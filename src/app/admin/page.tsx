import type { Metadata } from "next";
import Link from "next/link";
import { TYPE_LABEL, allEntries, allSources, citingEntries, getImage, hrefFor, sourcesFor } from "@/lib/db";
import { validateAll, canPublish } from "@/lib/validate";
import type { EntryType, Status } from "@/lib/types";

export const metadata: Metadata = { title: "Editorial dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<Status, string> = {
  published: "bg-sage-strong text-paper",
  "in-review": "bg-gold/30 text-ink",
  draft: "border border-stone/50 text-stone",
};

export default function AdminPage() {
  const entries = allEntries({ includeUnpublished: true });
  const issues = validateAll();
  const sources = allSources();
  const byStatus = (s: Status) => entries.filter((e) => e.status === s).length;
  const types = [...new Set(entries.map((e) => e.type))] as EntryType[];
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const unverified = sources.filter((s) => !s.verified);
  const unused = sources.filter((s) => citingEntries(s.id).length === 0);
  const credited = entries.filter((e) => e.image && getImage(e.image.id)).length;
  const isDevOpen = !process.env.ADMIN_USER;

  return (
    <div className="bg-marble min-h-screen">
      <div className="container-ind py-10">
        {isDevOpen && (
          <p className="mb-6 data text-[11px] bg-gold/20 border border-gold/50 px-3 py-2">
            Development mode: the dashboard is open because ADMIN_USER / ADMIN_PASSWORD are not set. In production it returns 404 until they are.
          </p>
        )}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="rubric">Editorial dashboard</p>
            <h1 className="h1 mt-3">Knowledge base health</h1>
          </div>
          <p className="data text-stone max-w-sm">Read-only view of the seed repository. Records are edited as typed files and validated on every production build; see ARCHITECTURE.md for the planned database-backed editor.</p>
        </div>

        <dl className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[var(--color-rule)] border rule">
          {[
            ["Published", byStatus("published")],
            ["In review", byStatus("in-review")],
            ["Drafts", byStatus("draft")],
            ["Blocking errors", errors.length],
            ["Warnings", warnings.length],
            ["Sources (unverified)", `${sources.length} (${unverified.length})`],
          ].map(([k, v]) => (
            <div key={k as string} className="bg-ivory p-5">
              <dt className="eyebrow">{k}</dt>
              <dd className={`font-display text-4xl mt-1 ${k === "Blocking errors" && errors.length ? "text-terracotta" : ""}`}>{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 grid lg:grid-cols-[1fr_380px] gap-10">
          <section>
            <h2 className="h3 mb-4">Validation queue</h2>
            {issues.length === 0 ? <p className="text-stone">No issues.</p> : (
              <table className="w-full text-sm bg-ivory border rule">
                <thead><tr className="text-left border-b rule">{["Severity", "Entry", "Issue"].map((h) => <th key={h} className="eyebrow p-3">{h}</th>)}</tr></thead>
                <tbody>
                  {issues.map((i, n) => (
                    <tr key={n} className="border-b rule align-top">
                      <td className="p-3"><span className={`data text-[11px] px-1.5 py-0.5 ${i.severity === "error" ? "bg-terracotta text-parchment" : "bg-gold/30"}`}>{i.severity}</span></td>
                      <td className="p-3 data text-[12px]">{i.entryId}</td>
                      <td className="p-3">{i.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <p className="mt-3 data text-[11px] text-stone">Published entries with blocking errors fail the production build.</p>
          </section>

          <aside className="space-y-8">
            <div className="bg-ivory border rule p-5">
              <h2 className="eyebrow mb-3">Coverage by type</h2>
              <ul className="space-y-1.5 text-sm">
                {types.map((t) => (
                  <li key={t} className="flex justify-between"><span>{TYPE_LABEL[t]}</span><span className="data">{entries.filter((e) => e.type === t).length}</span></li>
                ))}
              </ul>
            </div>
            <div className="bg-ivory border rule p-5">
              <h2 className="eyebrow mb-3">Images</h2>
              <p className="text-sm">{credited} entries carry a credited plate. Every image record stores author, licence and source URL.</p>
            </div>
            <div className="bg-ivory border rule p-5">
              <h2 className="eyebrow mb-3">Bibliography</h2>
              <p className="text-sm">{unverified.length} records awaiting verification; {unused.length} not yet cited.</p>
              <ul className="mt-2 text-[12px] text-stone space-y-1">{unverified.map((s) => <li key={s.id}>· {s.authors} {s.year}</li>)}</ul>
            </div>
          </aside>
        </div>

        <section className="mt-14">
          <h2 className="h3 mb-4">All records</h2>
          <div className="overflow-x-auto bg-ivory border rule">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="text-left border-b-2 border-ink">{["Status", "Type", "Title", "Sources", "Publishable", "Revised", "Editor"].map((h) => <th key={h} className="eyebrow p-3">{h}</th>)}</tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-b rule hover:bg-parchment">
                    <td className="p-3"><span className={`data text-[11px] px-1.5 py-0.5 ${STATUS_STYLE[e.status]}`}>{e.status}</span></td>
                    <td className="p-3 data text-[11px] text-stone">{TYPE_LABEL[e.type]}</td>
                    <td className="p-3">{e.status === "published" ? <Link href={hrefFor(e)} className="hover:text-terracotta">{e.title}</Link> : e.title}</td>
                    <td className="p-3 data text-[12px]">{sourcesFor(e).length}</td>
                    <td className="p-3">{canPublish(e) ? <span className="text-sage-deep">✓</span> : <span className="text-terracotta">blocked</span>}</td>
                    <td className="p-3 data text-[11px] text-stone">{e.updated}</td>
                    <td className="p-3 text-[12px] text-stone">{e.editor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
