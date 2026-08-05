import Filter from "./Filter";
import Loading from "Components/Common/FlightPlanListLoading";
import { useViewPlanCancel } from "./viewPlanSession";
import ViewPlanSteps from "./ViewPlanSteps";
import { useViewPlanController } from "./useViewPlanController";

export default function ViewPlan({
  vluchtnummer,
  setVluchtnummer,
}: {
  vluchtnummer: string;
  setVluchtnummer: (value: string) => void;
}) {
  const handleCancel = useViewPlanCancel(setVluchtnummer);
  const { initialPlans, step, openFilter, loading, refetch } =
    useViewPlanController();

  if (loading) {
    return <Loading />;
  }

  if (openFilter) {
    return <Filter plans={initialPlans} />;
  }

  return (
    <ViewPlanSteps
      step={step}
      vluchtnummer={vluchtnummer}
      setVluchtnummer={setVluchtnummer}
      handleCancel={handleCancel}
      refetch={refetch}
    />
  );
}
