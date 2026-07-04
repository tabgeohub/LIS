import { findSpecificPoint } from "../../../EnrichedAddPoint/helpers/findSpecificPoint";

export function removeAddPointMapGraphics(input: {
  mapView: __esri.MapView | null;
  currentPoint: { x: number; y: number };
  xCoord: number;
  yCoord: number;
}) {
  if (input.currentPoint.x !== 0 && input.currentPoint.y !== 0) {
    const currentGraphicToRemove = findSpecificPoint({
      mapView: input.mapView,
      x: input.currentPoint.x,
      y: input.currentPoint.y,
    });
    if (currentGraphicToRemove) {
      input.mapView?.graphics.remove(currentGraphicToRemove);
    }
  }

  const graphicToRemove = findSpecificPoint({
    mapView: input.mapView,
    x: input.xCoord,
    y: input.yCoord,
  });
  if (graphicToRemove) {
    input.mapView?.graphics.remove(graphicToRemove);
  }
}

export function resetAddPointFormState(input: {
  graphicsLayer: __esri.GraphicsLayer | null;
  graphicsLayerHover: __esri.GraphicsLayer | null;
  setOpenTable: (value: boolean) => void;
  setOpenFilter: (value: boolean) => void;
  setAddPointStep: (value: number) => void;
  setXCoord: (value: number) => void;
  setYCoord: (value: number) => void;
  setLatitude: (value: number) => void;
  setLongitude: (value: number) => void;
  setCoordinateSystem: (value: string) => void;
  setVertrouwelijk: (value: boolean) => void;
  setHerhalen: (value: boolean) => void;
  setOmschrijving: (value: string) => void;
  setActiviteit: (value: string) => void;
  setOrganisatie: (value: string) => void;
  setSpecifiekLettenOp: (value: string) => void;
  setCurrentPoint: (value: { x: number; y: number }) => void;
}) {
  input.setOpenTable(false);
  input.setOpenFilter(false);
  input.graphicsLayer?.removeAll();
  input.graphicsLayerHover?.removeAll();
  input.setAddPointStep(1);
  input.setXCoord(0);
  input.setYCoord(0);
  input.setLatitude(0);
  input.setLongitude(0);
  input.setCoordinateSystem("RD");
  input.setVertrouwelijk(false);
  input.setHerhalen(false);
  input.setOmschrijving("");
  input.setActiviteit("");
  input.setOrganisatie("");
  input.setSpecifiekLettenOp("");
  input.setCurrentPoint({ x: 0, y: 0 });
}
