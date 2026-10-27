/** Format DB/ISO finished_at for observation detail fields. */
export function formatFinishedAtDisplay(
  finishedAt?: string | null
): string | undefined {
  if (!finishedAt) return undefined;
  const parts = String(finishedAt).split("T");
  if (parts.length < 2) {
    const parsed = new Date(finishedAt);
    if (Number.isNaN(parsed.getTime())) return undefined;
    const iso = parsed.toISOString();
    return `${iso.split("T")[0]} - ${iso.split("T")[1]}`;
  }
  return `${parts[0]} - ${parts[1]}`;
}
