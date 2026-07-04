/* eslint-disable react-hooks/exhaustive-deps */
import { useAuth } from "@helpers/ZustandStates/useAuth";
import Filter from "./Filter";
import Loading from "./Common/Loading";
import { useRenderVluchtplans } from "hooks/useRenderVluchtPlans";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import { EMPTY_FLIGHT_PLANS } from "@constants/emptyFlightPlans";
import { useFlightPlansList } from "api-hooks/flightPlans";
import { useViewPlanCancel } from "./viewPlanSession";
import ViewPlanSteps from "./ViewPlanSteps";
import { useViewPlanFilteredPlans } from "./useViewPlanFilteredPlans";

export default function ViewPlan({
  vluchtnummer,
  setVluchtnummer,
}: {
  vluchtnummer: string;
  setVluchtnummer: (value: string) => void;
}) {
  const { user } = useAuth();
  const handleCancel = useViewPlanCancel(setVluchtnummer);

  const {
    initialPlans,
    step,
    openFilter,
    dateVan,
    dateTot,
    filterInput,
    setFilteredPlans,
    setFilterInput,
  } = useViewPlanState();

  const { data, isPending, refetch: refetchFlightPlans } = useFlightPlansList({
    regioId: user.role,
    userId: user.user_id,
  });

  const flightPlans = data ?? EMPTY_FLIGHT_PLANS;
  const refetch = () => {
    if (user.user_id === undefined || user.user_id === 0) return;
    refetchFlightPlans();
  };

  useRenderVluchtplans(flightPlans);

  useViewPlanFilteredPlans({
    initialPlans,
    flightPlans,
    filterInput,
    dateVan,
    dateTot,
    setFilteredPlans,
    setFilterInput,
  });

  const loading = isPending;

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
