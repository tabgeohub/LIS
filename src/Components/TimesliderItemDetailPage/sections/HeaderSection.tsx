import { Link } from "react-router-dom";
import ReadOnlyVanTotRange from "./ReadOnlyVanTotRange";

type Props = {
  itemName: string;
  dateFrom: string;
  dateTo: string;
  onAllPlansClick: () => void;
};

export default function HeaderSection({
  itemName,
  dateFrom,
  dateTo,
  onAllPlansClick,
}: Props) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-4">
      <Link
        to="/"
        className="shrink-0 text-sm font-medium text-primary hover:underline"
      >
        ← Kaart
      </Link>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
        <span
          className="min-w-0 truncate text-sm font-semibold text-gray-900"
          title={itemName}
        >
          {itemName}
        </span>
        <ReadOnlyVanTotRange dateFrom={dateFrom} dateTo={dateTo} />
        <button
          type="button"
          onClick={onAllPlansClick}
          className="shrink-0 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm transition-colors hover:bg-gray-50"
        >
          Meer datums bekijken
        </button>
      </div>
    </header>
  );
}
