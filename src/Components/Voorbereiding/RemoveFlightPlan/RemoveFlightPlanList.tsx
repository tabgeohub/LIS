import { FlightPlanType } from "Types";
import SinglePlan from "./SinglePlan";
import Loading from "./Loading";
import { AllPlansCheckbox } from "./AllPlansCheckbox";

export function RemoveFlightPlanList(props: {
  showAllPlans: boolean;
  setShowAllPlans: (value: boolean) => void;
  loading: boolean;
  allPlans: FlightPlanType[] | undefined;
  emptyMessage: string;
}) {
  const { loading, allPlans, emptyMessage } = props;
  return (
    <div className="divide-y-2 pt-6">
      <AllPlansCheckbox
        showAllPlans={props.showAllPlans}
        setShowAllPlans={props.setShowAllPlans}
      />
      {loading && <Loading />}
      {(!allPlans || allPlans.length === 0) && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-center text-gray-400 text-[12px]">{emptyMessage}</p>
        </div>
      )}
      {!loading &&
        allPlans?.map((plan: FlightPlanType) => (
          <SinglePlan key={plan.id} plan={plan} />
        ))}
    </div>
  );
}
