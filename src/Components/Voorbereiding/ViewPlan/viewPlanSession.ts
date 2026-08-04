import { useTabState } from "hooks/zustand/ui";
import { useOpenTable } from "hooks/zustand/ui";
import { useMapViewState } from "hooks/zustand/ui";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import { useViewPlanState } from "Components/Voorbereiding/ViewPlan/useViewPlanState";
import {
  applyFlightPlanFormValues,
  viewPlanFlightPlanFormDefaults,
  type FlightPlanFormFieldSetters,
} from "hooks/zustand/shared/flightPlanFormFields";
import type { TabType } from "Types";

export function resetViewPlanSession(input: {
  setVluchtnummer: (value: string) => void;
  graphicsLayer: __esri.GraphicsLayer | null;
  graphicsLayerHover: __esri.GraphicsLayer | null;
  yellowGraphicsLayer: __esri.GraphicsLayer | null;
  resetFeatures: () => void;
  setOpenTable: (value: boolean) => void;
  setSelectedTab: (value: TabType) => void;
  setViewPlanState: FlightPlanFormFieldSetters & {
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
  applyFlightPlanFormValues(
    input.setViewPlanState,
    viewPlanFlightPlanFormDefaults
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
