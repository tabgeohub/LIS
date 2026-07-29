import { FlightPlanType } from "Types";
import SinglePlan from "./FlightPlan";

export function ChangeFlightPlanStatusList(props: {
  filteredPlans: FlightPlanType[] | undefined;
  filterTerm: string;
  emptyLabel: string;
}) {
  const plans = props.filteredPlans?.filter((plan) =>
    plan.vluchtnummer.toLowerCase().includes(props.filterTerm.toLowerCase())
  );

  return (
    <div className="divide-y-2">
      {(!props.filteredPlans || props.filteredPlans.length === 0) && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-center text-gray-400 text-[12px]">
            {props.emptyLabel}
          </p>
        </div>
      )}
      {plans?.map((plan) => (
        <SinglePlan plan={plan} key={plan.id} />
      ))}
    </div>
  );
}
