/** Read-only replica of timeslider VAN / TOT pills + range track (no interaction). */

export function formatUrlDateToNl(yyyyMmDd: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(yyyyMmDd.trim());
  if (!m) return yyyyMmDd || "—";
  const [, y, mo, d] = m;
  return `${d}/${mo}/${y}`;
}

export const HANDLE_LEFT_PCT = 18;
export const HANDLE_RIGHT_PCT = 92;

export function ReadOnlyRangeTrack() {
  return (
    <div className="relative h-7 w-[7.5rem] shrink-0 sm:w-36" aria-hidden>
      <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gray-200">
        <div
          className="absolute top-0 h-full rounded-full bg-gray-400"
          style={{
            left: `${HANDLE_LEFT_PCT}%`,
            width: `${HANDLE_RIGHT_PCT - HANDLE_LEFT_PCT}%`,
          }}
        />
      </div>
      <div
        className="absolute top-1/2 z-[1] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gray-500 shadow-[0_0_0_3px_rgba(107,114,128,0.35)]"
        style={{ left: `${HANDLE_LEFT_PCT}%` }}
      />
      <div
        className="absolute top-1/2 z-[1] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-gray-500 shadow-[0_0_0_3px_rgba(107,114,128,0.35)]"
        style={{ left: `${HANDLE_RIGHT_PCT}%` }}
      />
    </div>
  );
}

export function ReadOnlyVanPill({ label }: { label: string }) {
  return (
    <div className="flex overflow-hidden rounded-lg shadow-sm ring-1 ring-gray-200/90">
      <div className="flex items-center bg-gray-500 px-2.5 py-1.5 text-[11px] font-bold uppercase leading-none tracking-wide text-white">
        VAN
      </div>
      <div className="flex min-w-[5.75rem] items-center justify-center bg-white px-3 py-1.5 text-sm font-normal tabular-nums text-gray-900">
        {label}
      </div>
    </div>
  );
}

export function ReadOnlyTotPill({ label }: { label: string }) {
  return (
    <div className="flex overflow-hidden rounded-lg shadow-sm ring-1 ring-gray-200/90">
      <div className="flex min-w-[5.75rem] items-center justify-center bg-white px-3 py-1.5 text-sm font-normal tabular-nums text-gray-900">
        {label}
      </div>
      <div className="flex items-center bg-gray-500 px-2.5 py-1.5 text-[11px] font-bold uppercase leading-none tracking-wide text-white">
        TOT
      </div>
    </div>
  );
}
