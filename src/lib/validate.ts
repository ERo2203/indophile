/**
 * Editorial validation. The same rules run in the admin dashboard and in
 * every production build, which fails if any published entry has an error.
 * This is what makes it hard to publish unsupported claims.
 */
import type { Entry } from "./types";
import { allEntries, getEntryAnyStatus, getImage, getSource } from "./db";

export type Severity = "error" | "warning";
export interface Issue {
  entryId: string;
  severity: Severity;
  message: string;
}

export function validateEntry(e: Entry): Issue[] {
  const out: Issue[] = [];
  const push = (severity: Severity, message: string) => out.push({ entryId: e.id, severity, message });

  const sectionCites = "sections" in e ? (e.sections ?? []).flatMap((s) => s.cite ?? []) : [];
  const allCites = [...e.cite, ...sectionCites];

  if (e.type !== "subject" && allCites.length === 0) push("error", "No sources cited.");
  for (const c of allCites) if (!getSource(c.sourceId)) push("error", `Cites unknown source "${c.sourceId}".`);
  const known = allCites.map((c) => getSource(c.sourceId)).filter(Boolean);
  if (known.length > 0 && known.every((s) => !s!.verified)) push("warning", "Relies only on unverified bibliographic records.");

  if ("sections" in e) {
    for (const s of e.sections ?? []) {
      if ((s.evidence === "established" || s.evidence === "well-supported") && !(s.cite?.length))
        push("error", `Section "${s.heading}" is marked ${s.evidence} but cites nothing.`);
    }
  }

  for (const rid of e.related ?? []) if (!getEntryAnyStatus(rid)) push("warning", `Dangling relation to "${rid}".`);
  for (const pid of e.periods ?? []) if (!getEntryAnyStatus(pid)) push("error", `Unknown period "${pid}".`);
  if (e.image && !getImage(e.image.id)) push("error", `Image "${e.image.id}" has no attribution record.`);
  if (e.type === "polity" && e.extent) {
    const n = (e.extent.evidence?.length ?? 0) + (e.extent.anchors?.length ?? 0) + (e.extent.zones?.flat().length ?? 0);
    if (n === 0) push("error", "Territory has no located evidence.");
    for (const id of e.extent.evidence ?? []) if (!getEntryAnyStatus(id)) push("error", `Territory evidence "${id}" does not exist.`);
  }
  if (e.type === "collection") for (const i of e.items) if (!getEntryAnyStatus(i.id)) push("error", `Collection item "${i.id}" does not exist.`);
  if (!e.dates && !["subject", "concept", "collection"].includes(e.type)) push("warning", "No date range.");

  return out;
}

export function validateAll(): Issue[] {
  return allEntries({ includeUnpublished: true }).flatMap(validateEntry);
}

/** Can this entry be published? (Drafts may have errors; published ones may not.) */
export function canPublish(e: Entry): boolean {
  return validateEntry(e).every((i) => i.severity !== "error");
}

let checked = false;
/** Throws (failing `next build`) if any published entry has a blocking error. */
export function assertPublishedValid() {
  if (checked) return;
  checked = true;
  const bad = validateAll().filter(
    (i) => i.severity === "error" && allEntries().some((e) => e.id === i.entryId),
  );
  if (bad.length) {
    throw new Error(
      "Editorial validation failed for published entries:\n" + bad.map((i) => `  ${i.entryId}: ${i.message}`).join("\n"),
    );
  }
}
