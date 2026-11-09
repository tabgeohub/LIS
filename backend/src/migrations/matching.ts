export interface MatchPoint { id: string; name: string; region: string; latitude: number; longitude: number; rdX: number; rdY: number; geometryId: string | null }
export interface MatchGeometry { id: string; name: string; region: string; type: string; vertices: MatchPoint[] }
export type MatchResult<T> = { kind: "create" } | { kind: "reuse"; value: T } | { kind: "conflict"; reason: string };
export const normalizedName = (name: string): string => name.normalize("NFC").trim();
function coordinatesEqual(a: MatchPoint, b: MatchPoint): boolean { return (["latitude", "longitude", "rdX", "rdY"] as const).every(key => Number.isFinite(a[key]) && Number.isFinite(b[key]) && a[key] === b[key]); }
function candidates<T extends { name: string }>(source: T, destination: T[]): T[] { return destination.filter(item => normalizedName(item.name) === normalizedName(source.name)); }
export function matchPoint(source: MatchPoint, destination: MatchPoint[], region: string): MatchResult<MatchPoint> {
  if (!normalizedName(source.name) || !coordinatesEqual(source, source)) return { kind: "conflict", reason: "Invalid point name or coordinates" };
  const matches = candidates(source, destination);
  if (matches.length > 1) return { kind: "conflict", reason: "Ambiguous point name" };
  if (!matches.length) return { kind: "create" };
  const point = matches[0];
  if (point.region !== region || !coordinatesEqual(source, point) || (source.geometryId === null) !== (point.geometryId === null)) return { kind: "conflict", reason: "Incompatible point" };
  return { kind: "reuse", value: point };
}
export function matchGeometry(source: MatchGeometry, destination: MatchGeometry[], region: string): MatchResult<MatchGeometry> {
  if (!normalizedName(source.name) || !source.vertices.length || source.vertices.some(point => !coordinatesEqual(point, point))) return { kind: "conflict", reason: "Invalid geometry" };
  const matches = candidates(source, destination);
  if (matches.length > 1) return { kind: "conflict", reason: "Ambiguous geometry name" };
  if (!matches.length) return { kind: "create" };
  const geometry = matches[0];
  if (geometry.region !== region || geometry.type !== source.type || geometry.vertices.length !== source.vertices.length || source.vertices.some((point, index) => normalizedName(point.name) !== normalizedName(geometry.vertices[index].name) || !coordinatesEqual(point, geometry.vertices[index]))) return { kind: "conflict", reason: "Incompatible geometry or vertices" };
  return { kind: "reuse", value: geometry };
}
