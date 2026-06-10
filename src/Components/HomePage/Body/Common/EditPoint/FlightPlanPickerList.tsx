import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FlightPlanType } from "Types";

dayjs.locale("nl");

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
            <div
              key={plan.id}
              onClick={() => onSelectPlan(plan)}
              className={`text-[14px] px-5 py-1 cursor-pointer transition-all relative ${
                selectedPlan?.id === plan.id
                  ? "bg-gray-100"
                  : "hover:bg-blue-100"
              }`}
            >
              {showFinishedBadge && plan.is_finished && (
                <FaCheckCircle className="absolute top-1 right-1 text-green-500 text-lg" />
              )}

              <div className="flex gap-x-2 items-center font-medium">
                <p>vluchtplan: </p>
                <p>{plan.vluchtnummer}</p>
              </div>

              <div className="flex gap-x-2 items-center text-gray-500">
                <p>datum: </p>
                <p className="capitalize">
                  {dayjs(plan.datum).format("DD MMM YYYY")}
                </p>
              </div>

              <div className="flex gap-x-2 items-center text-gray-500">
                <p>{additionalInfoLabel}: </p>
                <p>{plan.aanvullende}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollButtonsLayout>
    </div>
  );
}
