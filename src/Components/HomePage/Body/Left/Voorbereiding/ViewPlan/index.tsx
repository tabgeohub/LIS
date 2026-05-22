/* eslint-disable react-hooks/exhaustive-deps */
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useEffect } from "react";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import Filter from "./Filter";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import EditPoint from "./Steps/EditPoint";
import Loading from "./Common/Loading";
import AddPointStep from "./Steps/AddPointStep";
import DuplicateFlightPlan from "./Steps/DuplicateFlightPlan";
import { useRenderVluchtplans } from "hooks/useRenderVluchtPlans";
import { filterPlans } from "@helpers/filterPlans";
import { FlightPlanType } from "Types";
import { useViewPlanState } from "./helpers/useViewPlanState";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import AddPointsFromPlan from "./Steps/AddPointsFromPlan";
import AddPointToPlan from "./Steps/AddPointToPlan";
import { EMPTY_FLIGHT_PLANS } from "@constants/emptyFlightPlans";
import { useFlightPlansList } from "hooks/queries/useFlightPlanQueries";

export default function ViewPlan({
  vluchtnummer,
  setVluchtnummer,
}: {
  vluchtnummer: string;
  setVluchtnummer: (value: string) => void;
}) {
  const { graphicsLayer, graphicsLayerHover, yellowGraphicsLayer } =
    useMapViewState();

  const { setOpenTable } = useOpenTable();
  const { setSelectedTab } = useTabState();
  const { user } = useAuth();
  const { resetFeatures } = useResetFeatures();

  const {
    initialPlans,
    step,
    setStep,
    openFilter,
    setOpenFilter,
    dateVan,
    dateTot,
    filterInput,
    setFilterInput,
    setFilteredPlans,
    setOmschrijving,
    setWaarnemer,
    setPiloot,
    setDatum,
    setGeplandeVliegduur,
    setTypeLuchtvaartuig,
    setAantalPassagiers,
    setDoelEnHoofdthema,
    setAanvullendeInfo,
    setSelectedPlan,
  } = useViewPlanState();

  const {
    data,
    isPending,
    refetch: refetchFlightPlans,
  } = useFlightPlansList(user.role, user.user_id);

  const flightPlans = data ?? EMPTY_FLIGHT_PLANS;

  const refetch = () => {
    if (user.user_id === undefined || user.user_id === 0) return;
    refetchFlightPlans();
  };

  useRenderVluchtplans(flightPlans);

  useEffect(() => {
    if (!initialPlans.length && !flightPlans.length) return;

    const nextFiltered = filterPlans(
      initialPlans,
      filterInput,
      dateVan,
      dateTot
    );

    const { filteredPlans: currentFiltered } = useViewPlanState.getState();
    if (
      currentFiltered.length === nextFiltered.length &&
      currentFiltered.every((p, i) => p.id === nextFiltered[i]?.id)
    ) {
      return;
    }

    setFilteredPlans(nextFiltered);
  }, [dateVan, dateTot, filterInput, initialPlans, flightPlans.length, setFilteredPlans]);

  useEffect(() => {
    setFilterInput("");
  }, []);

  function handleCancel() {
    graphicsLayer?.removeAll();
    graphicsLayerHover?.removeAll();
    yellowGraphicsLayer?.removeAll();

    resetFeatures();

    setOpenTable(false);
    setVluchtnummer("");
    setOmschrijving("");
    setWaarnemer("");
    setPiloot("");
    setDatum("");
    setGeplandeVliegduur("0:00");
    setTypeLuchtvaartuig("");
    setAantalPassagiers(0);
    setDoelEnHoofdthema("");
    setAanvullendeInfo("");
    setOpenFilter(false);
    setSelectedTab("none");

    // @ts-ignore
    setSelectedPlan(null);
    setStep(1);
  }

  const loading = isPending;

  return (
    <>
      {loading && <Loading />}

      {!openFilter && !loading && (
        <>
          {step === 1 && (
            <Step1
              setVluchtnummer={setVluchtnummer}
              handleCancel={handleCancel}
            />
          )}

          {step === 2 && (
            <Step2
              vluchtnummer={vluchtnummer}
              setVluchtnummer={setVluchtnummer}
              handleCancel={handleCancel}
              refetch={refetch}
            />
          )}

          {step === 3 && <EditPoint />}

          {step === 4 && <AddPointStep />}

          {step === 5 && (
            <DuplicateFlightPlan
              refetch={refetch}
              handleCancel={handleCancel}
            />
          )}

          {step === 6 && <AddPointsFromPlan />}

          {step === 7 && <AddPointToPlan />}
        </>
      )}

      {openFilter && <Filter plans={initialPlans} />}
    </>
  );
}
