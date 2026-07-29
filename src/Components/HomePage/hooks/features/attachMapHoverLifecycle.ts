import { validateMapView } from "Components/HomePage/helpers/ArcGISHelpers/validateMapView";
import { useHoveredGraphicState } from "hooks/zustand/ui/hoveredGraphic";
import { registerMapHoverHandler } from "./registerMapHoverHandler";

type PinRefMap = Map<
  number,
  { outerGraphic: __esri.Graphic; pinGraphic: __esri.Graphic }
>;

export type AttachMapHoverLifecycleInput = {
  mapView: __esri.MapView | null | undefined;
  pointsGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  geometriesGraphicsLayer: __esri.GraphicsLayer | null | undefined;
  pinRefs?: React.MutableRefObject<PinRefMap>;
  checkMapContainer?: boolean;
};

/** Register map pointer hover; returns cleanup or undefined when inactive. */
export function attachMapHoverLifecycle(input: AttachMapHoverLifecycleInput) {
  if (!validateMapView(input.mapView)) return;

  const { setHovered } = useHoveredGraphicState.getState();
  const handle = registerMapHoverHandler({
    mapView: input.mapView!,
    pointsGraphicsLayer: input.pointsGraphicsLayer,
    geometriesGraphicsLayer: input.geometriesGraphicsLayer,
    pinRefs: input.pinRefs,
    checkMapContainer: input.checkMapContainer ?? false,
    onHovered: setHovered,
  });

  return () => {
    handle.remove();
    useHoveredGraphicState.getState().setHovered(null);
  };
}
