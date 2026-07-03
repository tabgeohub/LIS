import { useTabState } from "@helpers/ZustandStates/tabState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import { emptyFlightPlanFormFields } from "hooks/zustand/shared/flightPlanFormFields";

export function resetViewPlanSession(input: {
  setVluchtnummer: (value: string) => void;
  graphicsLayer: __esri.GraphicsLayer | null;
  graphicsLayerHover: __esri.GraphicsLayer | null;
  yellowGraphicsLayer: __esri.GraphicsLayer | null;
  resetFeatures: () => void;
  setOpenTable: (value: boolean) => void;
  setSelectedTab: (value: string) => void;
  setViewPlanState: {
    setOmschrijving: (value: string) => void;
    setWaarnemer: (value: string) => void;
    setPiloot: (value: string) => void;
    setDatum: (value: string) => void;
    setGeplandeVliegduur: (value: string) => void;
    setTypeLuchtvaartuig: (value: string) => void;
    setAantalPassagiers: (value: number | null | undefined) => void;
    setDoelEnHoofdthema: (value: string) => void;
    setAanvullendeInfo: (value: string) => void;
    setOpenFilter: (value: boolean) => void;
    setSelectedPlan: (value: null) => void;
    setStep: (value: number) => void;
  };
}) {
  input.graphicsLayer?.removeAll();
  input.graphicsLayerHover?.removeAll();
  input.yellowGraphicsLayer?.removeAll();
  input.resetFeatures();
  input.setOpenTable(false);
  input.setVluchtnummer("");
  input.setViewPlanState.setOmschrijving(emptyFlightPlanFormFields.omschrijving);
  input.setViewPlanState.setWaarnemer(emptyFlightPlanFormFields.waarnemer);
  input.setViewPlanState.setPiloot(emptyFlightPlanFormFields.piloot);
  input.setViewPlanState.setDatum(emptyFlightPlanFormFields.datum);
  input.setViewPlanState.setGeplandeVliegduur("0:00");
  input.setViewPlanState.setTypeLuchtvaartuig(
    emptyFlightPlanFormFields.typeLuchtvaartuig
  );
  input.setViewPlanState.setAantalPassagiers(0);
  input.setViewPlanState.setDoelEnHoofdthema(
    emptyFlightPlanFormFields.doelEnHoofdthema
  );
  input.setViewPlanState.setAanvullendeInfo(
    emptyFlightPlanFormFields.aanvullendeInfo
  );
  input.setViewPlanState.setOpenFilter(false);
  input.setSelectedTab("none");
  input.setViewPlanState.setSelectedPlan(null);
  input.setViewPlanState.setStep(1);
}

export function useViewPlanCancel(setVluchtnummer: (value: string) => void) {
  const { graphicsLayer, graphicsLayerHover, yellowGraphicsLayer } =
    useMapViewState();
  const { setOpenTable } = useOpenTable();
  const { setSelectedTab } = useTabState();
  const { resetFeatures } = useResetFeatures();
  const viewPlanSetters = useViewPlanState();

  return () =>
    resetViewPlanSession({
      setVluchtnummer,
      graphicsLayer,
      graphicsLayerHover,
      yellowGraphicsLayer,
      resetFeatures,
      setOpenTable,
      setSelectedTab,
      setViewPlanState: viewPlanSetters,
    });
}
