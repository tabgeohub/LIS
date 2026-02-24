interface TabButtonsProps {
  tab: string;
  setTab: (tab: string) => void;
  pointsTableLength: number;
  geometriesTableLength: number;
  flightPlansLength: number;
}

export default function TabButtons({
  tab,
  setTab,
  pointsTableLength,
  geometriesTableLength,
  flightPlansLength,
}: TabButtonsProps) {
  return (
    <div className="flex gap-2 px-2 pt-2 shrink-0">
      {pointsTableLength > 0 && (
        <button
          className={`px-2 py-1 text-sm border rounded-t-lg ${
            tab === "points"
              ? "bg-white"
              : "bg-gray-200 shadow-[rgba(0,_0,_0,_0.24)_0px_1px_8px]"
          }`}
          onClick={() => setTab("points")}
        >
          Aandachtspunten
        </button>
      )}

      {geometriesTableLength > 0 && (
        <button
          className={`px-2 py-1 text-sm border rounded-t-lg ${
            tab === "geometries"
              ? "bg-white"
              : "bg-gray-200 shadow-[rgba(0,_0,_0,_0.24)_0px_1px_8px]"
          }`}
          onClick={() => setTab("geometries")}
        >
          Geometrieën
        </button>
      )}

      {flightPlansLength > 0 && (
        <button
          className={`px-2 py-1 text-sm border rounded-t-lg ${
            tab === "flightPlans"
              ? "bg-white"
              : "bg-gray-200 shadow-[rgba(0,_0,_0,_0.24)_0px_1px_8px]"
          }`}
          onClick={() => setTab("flightPlans")}
        >
          Vluchtplan
        </button>
      )}
    </div>
  );
}

