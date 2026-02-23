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
import { useFlightPlansStore } from "hooks/features/useFlightPlansStore";

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
    setInitialPlans,
  } = useViewPlanState();

  const { flightPlans, fetchFlightPlans, refetchFlightPlans } = useFlightPlansStore();

  // Fetch flight plans when component mounts or user changes
  useEffect(() => {
    if (user.user_id === undefined || user.user_id === 0) return;
    fetchFlightPlans(user.role);
  }, [user.user_id, user.role]);

  // Update initialPlans when flightPlans are fetched
  useEffect(() => {
    if (flightPlans.length > 0) {
      setInitialPlans(flightPlans);
    }
  }, [flightPlans, setInitialPlans]);

  const refetch = () => {
    if (user.user_id === undefined || user.user_id === 0) return;
    refetchFlightPlans(user.role);
  };

  useRenderVluchtplans(flightPlans);

  useEffect(() => {
    if (!initialPlans) return;

    const filteredPlans = filterPlans(
      initialPlans,
      filterInput,
      dateVan,
      dateTot
    );

    setFilteredPlans(filteredPlans);
  }, [dateVan, dateTot, filterInput, initialPlans]);

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

  const loading = flightPlans.length === 0 && user.user_id !== undefined && user.user_id !== 0;

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
