export interface MatchPoint { id: string; name: string; region: string; latitude: number; longitude: number; rdX: number; rdY: number; geometryId: string | null }
export interface MatchGeometry { id: string; name: string; region: string; type: string; vertices: MatchPoint[] }
export type MatchResult<T> = { kind: "create" } | { kind: "reuse"; value: T } | { kind: "conflict"; reason: string };
export const normalizedName = (name: string): string => name.normalize("NFC").trim();
function coordinatesEqual(a: MatchPoint, b: MatchPoint): boolean {
  return (["latitude", "longitude", "rdX", "rdY"] as const).every(k => Number.isFinite(a[k]) && Number.isFinite(b[k]) && a[k] === b[k]);
}
function lookup<T extends { name: string }>(source: T, candidates: T[]): T[] {
  return candidates.filter(candidate => normalizedName(candidate.name) === normalizedName(source.name));
}
export function matchPoint(source: MatchPoint, destination: MatchPoint[], region: string): MatchResult<MatchPoint> {
  if (!normalizedName(source.name) || !coordinatesEqual(source, source)) return { kind: "conflict", reason: "Invalid point name or coordinates" };
  const matches = lookup(source, destination);
  if (matches.length > 1) return { kind: "conflict", reason: "Ambiguous point name" };
  if (!matches.length) return { kind: "create" };
  const point = matches[0];
  if (point.region !== region || !coordinatesEqual(source, point) || (source.geometryId === null) !== (point.geometryId === null)) return { kind: "conflict", reason: "Incompatible point" };
  return { kind: "reuse", value: point };
}
export function matchGeometry(source: MatchGeometry, destination: MatchGeometry[], region: string): MatchResult<MatchGeometry> {
  if (!normalizedName(source.name) || !source.vertices.length || source.vertices.some(p => !coordinatesEqual(p, p))) return { kind: "conflict", reason: "Invalid geometry" };
  const matches = lookup(source, destination);
  if (matches.length > 1) return { kind: "conflict", reason: "Ambiguous geometry name" };
  if (!matches.length) return { kind: "create" };
  const geometry = matches[0];
  if (geometry.region !== region || geometry.type !== source.type || geometry.vertices.length !== source.vertices.length || source.vertices.some((p, i) => normalizedName(p.name) !== normalizedName(geometry.vertices[i].name) || !coordinatesEqual(p, geometry.vertices[i]))) return { kind: "conflict", reason: "Incompatible geometry or vertices" };
  return { kind: "reuse", value: geometry };
}
