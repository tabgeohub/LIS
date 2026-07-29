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

  return (
    <>
      {loading && <Loading />}

      {!openFilter && !loading && (
        <ViewPlanSteps
          step={step}
          vluchtnummer={vluchtnummer}
          setVluchtnummer={setVluchtnummer}
          handleCancel={handleCancel}
          refetch={refetch}
        />
      )}

      {openFilter && <Filter plans={initialPlans} />}
    </>
  );
}
