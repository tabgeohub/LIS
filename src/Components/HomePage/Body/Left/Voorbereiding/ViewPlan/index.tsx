/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import Filter from "./Filter";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import EditPoint from "./Steps/EditPoint";
import Loading from "./Common/Loading";
import AddPointStep from "./Steps/AddPointStep";
import DuplicateFlightPlan from "./Steps/DuplicateFlightPlan";
import { useRenderVluchtplans } from "hooks/useRenderVluchtPlans";
import { filterPlans } from "@helpers/filterPlans";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import { EMPTY_FLIGHT_PLANS } from "@constants/emptyFlightPlans";
import { useFlightPlansList } from "api-hooks/flightPlans";
import AddPointsFromPlan from "./Steps/AddPointsFromPlan";
import AddPointToPlan from "./Steps/AddPointToPlan";
import { useViewPlanCancel } from "./viewPlanSession";
import ViewPlanSteps from "./ViewPlanSteps";

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

  useEffect(() => {
    if (!initialPlans.length && !flightPlans.length) return;
    setFilteredPlans(
      filterPlans({ initialPlans, filterInput, dateVan, dateTot })
    );
  }, [dateVan, dateTot, filterInput, initialPlans, flightPlans.length, setFilteredPlans]);

  useEffect(() => {
    setFilterInput("");
  }, []);

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
