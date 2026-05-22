import { classNames } from "@helpers/classNames";

interface TabButtonsProps {
  tab: string;
  setTab: (tab: string) => void;
  pointsTableLength: number;
  geometriesTableLength: number;
  flightPlansLength: number;
}

type TabId = "points" | "geometries" | "flightPlans";

export default function TabButtons({
  tab,
  setTab,
  pointsTableLength,
  geometriesTableLength,
  flightPlansLength,
}: TabButtonsProps) {
  const tabs = (
    [
      { id: "points" as const, label: "Aandachtspunten", count: pointsTableLength },
      { id: "geometries" as const, label: "Geometrieën", count: geometriesTableLength },
      { id: "flightPlans" as const, label: "Vluchtplan", count: flightPlansLength },
    ] satisfies { id: TabId; label: string; count: number }[]
  ).filter((t) => t.count > 0);

  return (
    <div
      role="tablist"
      aria-label="Tabelweergave"
      className="flex gap-1 px-3 pt-2 pb-0 shrink-0 min-w-0 max-w-full overflow-hidden border-b border-gray-200 bg-gray-50"
    >
      {tabs.map(({ id, label, count }) => {
        const isActive = tab === id;

        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setTab(id)}
            className={classNames(
              "relative flex items-center gap-2 px-4 py-2 text-sm rounded-t-md border transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1",
              isActive
                ? "z-10 -mb-px bg-white border-gray-200 border-b-white text-primary font-semibold shadow-sm"
                : "bg-transparent border-transparent text-gray-500 font-medium hover:text-gray-800 hover:bg-gray-100/80"
            )}
          >
            <span>{label}</span>
            <span
              className={classNames(
                "inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-xs tabular-nums",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "bg-gray-200/80 text-gray-600"
              )}
            >
              {count}
            </span>
            {isActive && (
              <span
                className="absolute inset-x-0 -bottom-px h-0.5 bg-primary rounded-full"
                aria-hidden
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
