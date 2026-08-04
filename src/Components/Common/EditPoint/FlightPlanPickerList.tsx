import ScrollButtonsLayout from "Components/Common/ScrollButtonsLayout";
import { useEffect, useMemo, useState } from "react";
import { FlightPlanType } from "Types";
import { FlightPlanPickerRow } from "./FlightPlanPickerRow";

export default function FlightPlanPickerList({
  plans,
  selectedPlan,
  onSelectPlan,
  footerButtons,
  showFinishedBadge = false,
  emptyMessage = "Geen vluchtplannen",
  additionalInfoLabel = "aanvullendeInformatie",
  filterResetDeps,
}: {
  plans: FlightPlanType[];
  selectedPlan: FlightPlanType | null;
  onSelectPlan: (plan: FlightPlanType) => void;
  footerButtons: React.ReactNode;
  showFinishedBadge?: boolean;
  emptyMessage?: string;
  additionalInfoLabel?: string;
  filterResetDeps?: unknown[];
}) {
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (filterResetDeps === undefined) return;
    setFilter("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, filterResetDeps);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) =>
      plan.vluchtnummer.toLowerCase().includes(filter.toLowerCase())
    );
  }, [plans, filter]);

  return (
    <div className="h-full">
      <ScrollButtonsLayout setFilterTerm={setFilter} buttons={footerButtons}>
        <div className="divide-y-2 flex flex-col gap-y-2">
          {filteredPlans.length === 0 && (
            <p className="text-gray-500 text-sm p-2">{emptyMessage}</p>
          )}

          {filteredPlans.map((plan) => (
            <FlightPlanPickerRow
              key={plan.id}
              plan={plan}
              selected={selectedPlan?.id === plan.id}
              onSelect={() => onSelectPlan(plan)}
              showFinishedBadge={showFinishedBadge}
              additionalInfoLabel={additionalInfoLabel}
            />
          ))}
        </div>
      </ScrollButtonsLayout>
    </div>
  );
}
