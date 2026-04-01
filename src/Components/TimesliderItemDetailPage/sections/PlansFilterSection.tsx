import type { FinishedFlightPlanType } from "Types/finished_plans";

type Props = {
  plans: FinishedFlightPlanType[];
  selectedPlanId: number | null;
  onSelectPlan: (plan: FinishedFlightPlanType) => void;
  loading: boolean;
  emptyHint?: string;
};

export default function PlansFilterSection({
  plans,
  selectedPlanId,
  onSelectPlan,
  loading,
  emptyHint,
}: Props) {
  return (
    <section
      id="timeslider-item-plans"
      className="flex min-h-12 shrink-0 items-center gap-2 scroll-mt-14 border-b border-gray-200 bg-gray-50 px-4 py-2"
      aria-label="Plannen in deze selectie"
    >
      <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide text-gray-400">
        Plannen
      </span>
      {loading ? (
        <span className="text-xs text-gray-500">Laden…</span>
      ) : emptyHint ? (
        <span className="text-xs text-gray-500">{emptyHint}</span>
      ) : plans.length === 0 ? (
        <span className="text-xs text-gray-500">Geen plannen</span>
      ) : (
        <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {plans.map((p) => {
            const selected = p.id === selectedPlanId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPlan(p)}
                title={p.vluchtnummer || `Plan ${p.id}`}
                aria-pressed={selected}
                className={`inline-flex max-w-[10rem] truncate rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                  selected
                    ? "bg-primary text-white ring-1 ring-primary"
                    : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
                }`}
              >
                {p.vluchtnummer || `#${p.id}`}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
