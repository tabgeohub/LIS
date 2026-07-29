import PeriodFilter from "../PeriodFilter";
import SinglePlan from "./SinglePlan";
import { FinishedFlightPlanType } from "Types/finished_plans";
import { useContent } from "hooks/useContent";
import { useCreateReportFilterAndSortPlans } from "../../hooks/useCreateReportFilterAndSortPlans";

export default function Step1({ plans }: { plans: FinishedFlightPlanType[] }) {
  const { openFilter, filteredPlans } = useCreateReportFilterAndSortPlans(plans);
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
