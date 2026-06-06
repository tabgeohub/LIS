import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useFlightPlanState } from "hooks/zustand/voorbereiding/useFlightPlanState";

export function useCancelCreateFlightPlan() {
  const { setSelectedTab } = useTabState();

  const { mapView, yellowGraphicsLayer } = useMapViewState();

  const { hoveredGraphic, setHoveredGraphic, selectedGraphics, clear } =
    useFlightPlanState();

  function handleCancel() {
    clear();

    selectedGraphics.forEach((graphic) => mapView?.graphics.remove(graphic));
    yellowGraphicsLayer?.graphics.removeAll();

    if (hoveredGraphic) {
      mapView?.graphics.remove(hoveredGraphic);
      setHoveredGraphic(null);
    }
    setSelectedTab("none");
  }

  return handleCancel;
}
