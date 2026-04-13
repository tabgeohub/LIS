import { Link } from "react-router-dom";
import ReadOnlyVanTotRange from "./ReadOnlyVanTotRange";

type Props = {
  itemName: string;
  /** Flight number for the selected plan; shown under the point/geometry name when set. */
  vluchtnummer?: string | null;
  dateFrom: string;
  dateTo: string;
  onAllPlansClick: () => void;
};

export default function HeaderSection({
  itemName,
  vluchtnummer,
  dateFrom,
  dateTo,
  onAllPlansClick,
}: Props) {
  const vluchtLabel =
    vluchtnummer != null && vluchtnummer.trim() !== ""
      ? vluchtnummer.trim()
      : null;

  return (
    <header className="grid min-h-14 w-full shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-gray-200 bg-white px-4 py-2">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          to="/"
          className="shrink-0 text-sm font-medium text-primary hover:underline"
        >
          ← Kaart
        </Link>
        <div className="min-w-0 flex-1">
          <span
            className="block truncate text-sm font-semibold text-gray-900"
            title={itemName}
          >
            {itemName}
          </span>
          {vluchtLabel ? (
            <p
              className="mt-0.5 truncate text-[11px] text-gray-500"
              title={`Vluchtnummer : ${vluchtLabel}`}
            >
              <span className="text-gray-400">Vluchtnummer : </span>
              {vluchtLabel}
            </p>
          ) : null}
        </div>
      </div>
      <div className="justify-self-center">
        <ReadOnlyVanTotRange dateFrom={dateFrom} dateTo={dateTo} />
      </div>
      <div className="flex justify-end">
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
