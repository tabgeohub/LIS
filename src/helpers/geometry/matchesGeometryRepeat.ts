export function matchesGeometryRepeat(
  geometry: { herhalen?: number | string | boolean },
  repeat: boolean
) {
  if (typeof geometry.herhalen === "number") {
    return geometry.herhalen === Number(repeat);
  }
  if (typeof geometry.herhalen === "string") {
    return geometry.herhalen === String(Number(repeat));
  }
  return geometry.herhalen === repeat;
}
