import type { FinishedFlightPlanType } from "Types/finished_plans";

type Props = {
  plans: FinishedFlightPlanType[];
  selectedPlanId: number | null;
  onSelectPlan: (plan: FinishedFlightPlanType) => void;
  loading: boolean;
  emptyHint?: string;
  /** First preview image URL per plan id for this item (point/geometry). */
  firstImageUrlByPlanId: Record<number, string>;
  imagesLoading: boolean;
};

function planLabel(p: FinishedFlightPlanType) {
  return p.vluchtnummer?.trim() || `Plan ${p.id}`;
}

export default function PlansFilterSection({
  plans,
  selectedPlanId,
  onSelectPlan,
  loading,
  emptyHint,
  firstImageUrlByPlanId,
  imagesLoading,
}: Props) {
  return (
    <section
      id="timeslider-item-plans"
      className="flex min-h-12 shrink-0 flex-col gap-1.5 border-b border-gray-200 bg-gray-50 px-4 pb-2.5 pt-1.5 scroll-mt-14"
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
        <div className="flex min-w-0 flex-1 gap-3 overflow-x-auto pb-2 pl-5 pr-5 pt-1">
          {plans.map((p) => {
            const selected = p.id === selectedPlanId;
            const thumb = firstImageUrlByPlanId[p.id];
            const showThumbSkeleton = imagesLoading && !thumb;
            const label = planLabel(p);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPlan(p)}
                title={label}
                aria-pressed={selected}
                className={`flex w-[7.25rem] shrink-0 flex-col rounded-lg text-left shadow-sm transition-[box-shadow,transform] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 ${
                  selected
                    ? "ring-2 ring-primary ring-offset-0"
                    : "ring-1 ring-gray-200 hover:ring-gray-300"
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-200">
                  {showThumbSkeleton ? (
                    <div
                      className="absolute inset-0 animate-pulse bg-gray-300"
                      aria-hidden
                    />
                  ) : thumb ? (
                    <img
                      src={thumb}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
                      aria-hidden
                    >
                      <span className="text-[10px] font-medium text-gray-400">
                        Geen foto
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent px-2 pb-1.5 pt-6">
                    <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-white drop-shadow">
                      {label}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
