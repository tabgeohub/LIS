import { useMapViewState } from "hooks/zustand/ui";
import { useTabState } from "hooks/zustand/ui";
import { useFlightPlanState } from "Components/Voorbereiding/FlightPlan/useFlightPlanState";

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
