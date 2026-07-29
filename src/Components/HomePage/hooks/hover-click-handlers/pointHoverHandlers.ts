import { EnrichedPointType } from "Types";
import {
  clearPointHoverGraphic,
  replacePointHoverGraphic,
} from "Components/HomePage/helpers/ArcGISHelpers/pointHoverGraphics";

type HoverSetter = (value: {
  id: number;
  label: string;
  point: EnrichedPointType;
} | null) => void;

export function createPointHoverHandlers(input: {
  mapView: __esri.MapView | null | undefined;
  setHovered: HoverSetter;
}) {
  return {
    handleHoveredPoint(point: EnrichedPointType | null | undefined) {
      if (!input.mapView || !point) return;
      replacePointHoverGraphic(input.mapView, point);
      input.setHovered({
        id: point.id,
        label: point.omschrijving ?? `Punt ${point.id}`,
        point,
      });
    },
    handleRemoveHoverePoint() {
      if (!input.mapView) return;
      clearPointHoverGraphic(input.mapView);
      input.setHovered(null);
    },
  };
}
