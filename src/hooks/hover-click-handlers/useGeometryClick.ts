import { useEffect } from "react";
import {
  ClickableGeometry,
  createSelectionGeometryGraphic,
} from "@helpers/ArcGISHelpers/createGeometryMapGraphics";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { validateMapView } from "@helpers/ArcGISHelpers/validateMapView";
import useDrawYellowGeometries from "hooks/hover-click-handlers/useDrawYellowGeometries";

export type { ClickableGeometry } from "@helpers/ArcGISHelpers/createGeometryMapGraphics";

type SingleGeometryClickOptions = {
  selectedGeometry: ClickableGeometry | null;
  selectedGeometryIds?: never;
  allGeometries?: never;
  herhalenFilter?: never;
};

type MultiGeometryClickOptions = {
  selectedGeometry?: never;
  selectedGeometryIds: number[];
  allGeometries: ClickableGeometry[];
  herhalenFilter?: boolean | null;
};

export type UseGeometryClickOptions =
  | SingleGeometryClickOptions
  | MultiGeometryClickOptions;

function isMultiMode(
  options: UseGeometryClickOptions
): options is MultiGeometryClickOptions {
  return options.selectedGeometryIds !== undefined;
}

/**
 * Draws yellow selection graphics for geometries.
 * - Single mode (`selectedGeometry`): finished-plan waarnemingen on `yellowGraphicsLayer`
 * - Multi mode (`selectedGeometryIds` + `allGeometries`): DB geometries on `yellowGeometriesGraphicsLayer`
 */
export default function useGeometryClick(options: UseGeometryClickOptions) {
  const multi = isMultiMode(options);
  const { mapView, yellowGraphicsLayer } = useMapViewState();

  useDrawYellowGeometries({
    selectedGeometryIds: multi ? options.selectedGeometryIds : [],
    geometries: [],
    allGeometries: multi ? options.allGeometries : [],
    herhalenFilter: multi ? options.herhalenFilter : undefined,
  });

  const selectedGeometry = multi ? null : options.selectedGeometry;

  useEffect(() => {
    if (multi) return;
    if (!validateMapView(mapView, yellowGraphicsLayer)) return;

    yellowGraphicsLayer!.graphics.removeAll();

    if (!selectedGeometry?.points?.length) return;

    const graphic = createSelectionGeometryGraphic(
      selectedGeometry,
      selectedGeometry
    );

    if (graphic) {
      yellowGraphicsLayer!.add(graphic);
    }

    return () => {
      yellowGraphicsLayer?.graphics.removeAll();
    };
  }, [multi, selectedGeometry, mapView, yellowGraphicsLayer]);
}
