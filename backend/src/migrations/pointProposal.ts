import { createHash } from "node:crypto";
import { matchPoint, normalizedName, type MatchPoint } from "./matching";

export type PointMapping = {
  sourceId: string;
  action: "create" | "reuse" | "conflict";
  destinationId: string | null;
  sourceName: string;
  destinationName: string;
  renamed: boolean;
  reason?: string;
};
export type RenameConfirmation = { sourceId: string; destinationName: string };

export function adHocCandidateName(exportId: string, sourceId: string, baseName: string, attempt: number): string {
  const hash = createHash("sha256").update(JSON.stringify([exportId, sourceId, attempt])).digest("hex");
  const suffix = 100000 + Number(BigInt(`0x${hash}`) % 900000n);
  return `${normalizedName(baseName)}-${suffix}`;
}

/** Optional admin-chosen names for incompatible standalone points. Invalid entries are ignored. */
export function parseRequestedRenames(value: unknown): RenameConfirmation[] {
  if (value == null) return [];
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const result: RenameConfirmation[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const sourceId = (entry as { sourceId?: unknown }).sourceId;
    const destinationName = (entry as { destinationName?: unknown }).destinationName;
    if (typeof sourceId !== "string" || typeof destinationName !== "string" || seen.has(sourceId)) continue;
    seen.add(sourceId);
    result.push({ sourceId, destinationName });
  }
  return result;
}

/** One pure decision path for both read-only preview and locked import. */
export function proposePoints(
  source: MatchPoint[],
  destination: MatchPoint[],
  region: string,
  exportId: string,
  maxNameLength: number | null,
  requestedRenames: RenameConfirmation[] = [],
): PointMapping[] {
  const productionNames = new Set(destination.map(point => normalizedName(point.name)));
  // Reserve even not-yet-processed regular names, so a suffix cannot shadow one.
  const reserved = new Set([...productionNames, ...source.map(point => normalizedName(point.name))]);
  const createdNames = new Set<string>();
  const renameBySource = new Map(requestedRenames.map(entry => [entry.sourceId, entry.destinationName]));
  return source.map(point => {
    const mapping: PointMapping = { sourceId: point.id, action: "create", destinationId: null, sourceName: point.name, destinationName: point.name, renamed: false };
    const invalid = matchPoint(point, [], region);
    const conflict = (reason: string): PointMapping => ({ ...mapping, action: "conflict", reason });
    if (invalid.kind === "conflict") return conflict(invalid.reason);
    const base = normalizedName(point.name);
    const eligible = point.geometryId === null && base.toLowerCase().startsWith("ad hoc");
    if (eligible && (productionNames.has(base) || createdNames.has(base))) {
      for (let attempt = 0; attempt < 100; attempt++) {
        const candidate = adHocCandidateName(exportId, point.id, base, attempt);
        if (maxNameLength !== null && [...candidate].length > maxNameLength) return conflict("Renamed point exceeds production name length");
        if (reserved.has(candidate)) continue;
        reserved.add(candidate);
        createdNames.add(candidate);
        return { ...mapping, destinationName: candidate, renamed: true };
      }
      return conflict("No unused Ad hoc name after 100 attempts");
    }
    const match = matchPoint(point, destination, region);
    if (match.kind === "conflict") {
      const requested = renameBySource.get(point.id);
      if (
        requested !== undefined &&
        match.reason === "Incompatible point" &&
        point.geometryId === null
      ) {
        const candidate = normalizedName(requested);
        if (!candidate) return conflict(match.reason);
        if (maxNameLength !== null && [...candidate].length > maxNameLength) {
          return conflict("Renamed point exceeds production name length");
        }
        if (reserved.has(candidate) || createdNames.has(candidate)) {
          return conflict("Renamed point name already exists");
        }
        reserved.add(candidate);
        createdNames.add(candidate);
        return { ...mapping, destinationName: candidate, renamed: true };
      }
      return conflict(match.reason);
    }
    if (match.kind === "reuse") return { ...mapping, action: "reuse", destinationId: match.value.id, destinationName: match.value.name };
    if (maxNameLength !== null && [...point.name].length > maxNameLength) return conflict("Point exceeds production name length");
    createdNames.add(base);
    return mapping;
  });
}

export function renamedPoints(mappings: PointMapping[]): RenameConfirmation[] {
  return mappings.filter(point => point.renamed).map(({ sourceId, destinationName }) => ({ sourceId, destinationName }));
}

/** Client names are confirmations, never instructions to rename arbitrary rows. */
export function requireConfirmedRenames(mappings: PointMapping[], confirmation: unknown): void {
  const expected = renamedPoints(mappings);
  if (!Array.isArray(confirmation) || confirmation.length !== expected.length) throw new Error("PREVIEW_CHANGED");
  const actual = new Map<string, string>();
  for (const entry of confirmation) {
    if (!entry || typeof entry !== "object" || typeof entry.sourceId !== "string" || typeof entry.destinationName !== "string" || actual.has(entry.sourceId)) throw new Error("PREVIEW_CHANGED");
    actual.set(entry.sourceId, entry.destinationName);
  }
  if (expected.some(point => actual.get(point.sourceId) !== point.destinationName)) throw new Error("PREVIEW_CHANGED");
}
