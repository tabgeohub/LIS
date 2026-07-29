import { useMapViewState } from "hooks/zustand/ui";
import useDrawYellowGeometries from "./useDrawYellowGeometries";
import { isMultiGeometryMode, UseGeometryClickOptions } from "./geometryClickTypes";
import { useSingleGeometrySelectionGraphic } from "./useSingleGeometrySelectionGraphic";

export type { ClickableGeometry } from "@helpers/ArcGISHelpers/createGeometryMapGraphics";
export type { UseGeometryClickOptions } from "./geometryClickTypes";

export default function useGeometryClick(options: UseGeometryClickOptions) {
  const multi = isMultiGeometryMode(options);
  const { yellowGraphicsLayer } = useMapViewState();
  useDrawYellowGeometries({
    selectedGeometryIds: multi ? options.selectedGeometryIds : [],
    geometries: [],
    allGeometries: multi ? options.allGeometries : [],
    herhalenFilter: multi ? options.herhalenFilter : undefined,
  });
  useSingleGeometrySelectionGraphic({
    enabled: !multi,
    selectedGeometry: multi ? null : options.selectedGeometry,
    layer: yellowGraphicsLayer,
  });
}
