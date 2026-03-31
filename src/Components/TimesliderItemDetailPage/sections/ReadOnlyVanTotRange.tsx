/** Read-only replica of timeslider VAN / TOT pills + range track (no interaction). */

function formatUrlDateToNl(yyyyMmDd: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(yyyyMmDd.trim());
  if (!m) return yyyyMmDd || "—";
  const [, y, mo, d] = m;
  return `${d}/${mo}/${y}`;
}

type Props = {
  dateFrom: string;
  dateTo: string;
};

/**
 * Decorative handle positions (no min/max context on this page).
 * Matches reference: left ~20%, right toward end.
 */
const HANDLE_LEFT_PCT = 18;
const HANDLE_RIGHT_PCT = 92;

export default function ReadOnlyVanTotRange({ dateFrom, dateTo }: Props) {
  const hasRange = Boolean(dateFrom && dateTo);
  const fromLabel = hasRange ? formatUrlDateToNl(dateFrom) : "—";
  const toLabel = hasRange ? formatUrlDateToNl(dateTo) : "—";
  const ariaLabel = hasRange
    ? `Periode van ${fromLabel} tot ${toLabel} (alleen weergave)`
    : "Geen periode (alleen weergave)";

  return (
    <div
      className="pointer-events-none flex shrink-0 select-none items-center gap-3"
      aria-label={ariaLabel}
    >
      {/* VAN */}
      <div className="flex overflow-hidden rounded-lg shadow-sm ring-1 ring-gray-200/90">
        <div className="flex items-center bg-primary px-2.5 py-1.5 text-[11px] font-bold uppercase leading-none tracking-wide text-white">
          VAN
        </div>
        <div className="flex min-w-[5.75rem] items-center justify-center bg-white px-3 py-1.5 text-sm font-normal tabular-nums text-gray-900">
          {fromLabel}
        </div>
      </div>

      {/* Slider track + handles (read-only) */}
      <div
        className="relative h-7 w-[7.5rem] shrink-0 sm:w-36"
        aria-hidden
      >
        <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gray-200">
          <div
            className="absolute top-0 h-full rounded-full bg-primary"
            style={{
              left: `${HANDLE_LEFT_PCT}%`,
              width: `${HANDLE_RIGHT_PCT - HANDLE_LEFT_PCT}%`,
            }}
          />
        </div>
        <div
          className="absolute top-1/2 z-[1] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow-[0_0_0_3px_rgba(0,112,188,0.22)]"
          style={{ left: `${HANDLE_LEFT_PCT}%` }}
        />
        <div
          className="absolute top-1/2 z-[1] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow-[0_0_0_3px_rgba(0,112,188,0.22)]"
          style={{ left: `${HANDLE_RIGHT_PCT}%` }}
        />
      </div>

      {/* TOT */}
      <div className="flex overflow-hidden rounded-lg shadow-sm ring-1 ring-gray-200/90">
        <div className="flex min-w-[5.75rem] items-center justify-center bg-white px-3 py-1.5 text-sm font-normal tabular-nums text-gray-900">
          {toLabel}
        </div>
        <div className="flex items-center bg-primary px-2.5 py-1.5 text-[11px] font-bold uppercase leading-none tracking-wide text-white">
          TOT
        </div>
      </div>
    </div>
  );
}
