export function parseFinite(s: string): number | undefined {
  const t = s.trim();
  if (t === "") return undefined;
  const n = Number(t.replace(",", "."));
  return Number.isFinite(n) ? n : undefined;
}

export function toStr(n: number): string {
  return String(n);
}
