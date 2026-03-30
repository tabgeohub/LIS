import type { GeometryPointRow } from "./pointTypes";

export type PointFormState = {
  id: number;
  omschrijving: string;
  latitude: string;
  longitude: string;
  xcoordinaat_rd: string;
  ycoordinaat_rd: string;
};

function numStr(v: unknown): string {
  if (typeof v === "number" && Number.isFinite(v)) return String(v);
  return "";
}

export function pointToForm(p: GeometryPointRow): PointFormState {
  return {
    id: p.id,
    omschrijving: p.omschrijving ?? "",
    latitude: numStr(p.latitude),
    longitude: numStr(p.longitude),
    xcoordinaat_rd: numStr(
      (p as { xcoordinaat_rd?: number }).xcoordinaat_rd
    ),
    ycoordinaat_rd: numStr(
      (p as { ycoordinaat_rd?: number }).ycoordinaat_rd
    ),
  };
}

function parseNum(s: string): number | undefined {
  const t = s.trim();
  if (t === "") return undefined;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

export function formToPointRow(
  base: GeometryPointRow,
  f: PointFormState
): GeometryPointRow {
  const lat = parseNum(f.latitude);
  const lon = parseNum(f.longitude);
  const x = parseNum(f.xcoordinaat_rd);
  const y = parseNum(f.ycoordinaat_rd);

  return {
    ...base,
    omschrijving: f.omschrijving,
    ...(lat !== undefined ? { latitude: lat } : {}),
    ...(lon !== undefined ? { longitude: lon } : {}),
    ...(x !== undefined ? { xcoordinaat_rd: x } : {}),
    ...(y !== undefined ? { ycoordinaat_rd: y } : {}),
  } as GeometryPointRow;
}
