/* eslint-disable react-hooks/exhaustive-deps */
import { useCreateReportState } from "hooks/zustand/nabewerking/useCreateReportState";
import PeriodFilter from "../PeriodFilter";
import SinglePlan from "./SinglePlan";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useEffect } from "react";
import { useFilterPlans } from "hooks/filters/useFilterPlans";
import { useContent } from "hooks/useContent";

export default function Step1({ plans }: { plans: FinishedFlightPlanType[] }) {
  const { openFilter } = useCreateReportState();
  const filterPlans = useFilterPlans();

  const {
    periode,
    dateFrom,
    dateTo,
    filteredPlans,
    filterTerm,
    setFilteredPlans,
  } = useCreateReportState();

  useEffect(() => {
    if (!plans) return;

    const sortedPlansByCreatedAt = plans.sort((a, b) =>
      a.datum > b.datum ? -1 : 1
    );

    filterPlans(
      setFilteredPlans,
      sortedPlansByCreatedAt,
      filterTerm,
      dateFrom,
      dateTo,
      periode
    );
  }, [plans, filterTerm, periode]);

  const content = useContent();

  return (
    <div className="h-full">
      {!openFilter && (
        <div className="divide-y-2">
          {filteredPlans?.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <p className="text-center text-gray-400 text-[12px]">
                {content.nabewerking.createReport.noPlans}{" "}
              </p>
            </div>
          )}

          {filteredPlans?.map((plan, index) => (
            <SinglePlan key={index} plan={plan} />
          ))}
        </div>
      )}

      {openFilter && <PeriodFilter />}
    </div>
  );
}
