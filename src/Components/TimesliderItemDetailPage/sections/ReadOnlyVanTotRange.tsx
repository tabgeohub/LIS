import {
  formatUrlDateToNl,
  ReadOnlyRangeTrack,
  ReadOnlyTotPill,
  ReadOnlyVanPill,
} from "./readOnlyVanTotParts";

type Props = {
  dateFrom: string;
  dateTo: string;
};

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
      <ReadOnlyVanPill label={fromLabel} />
      <ReadOnlyRangeTrack />
      <ReadOnlyTotPill label={toLabel} />
    </div>
  );
}
