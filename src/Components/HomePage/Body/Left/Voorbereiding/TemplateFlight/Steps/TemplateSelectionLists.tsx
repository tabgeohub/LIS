import GeometriesList from "../../FlightPlan/Common/GeometriesList";
import PointsList from "../PointsList";
import type { TemplateSelectionBodyProps } from "./templateSelectionBodyProps";

export function TemplateSelectionLists(
  p: Pick<
    TemplateSelectionBodyProps,
    | "selectedGeometries"
    | "setSelectedGeometries"
    | "displayedGeometries"
    | "selectedPoints"
    | "setSelectedPoints"
    | "displayedPoints"
    | "step"
  >
) {
  return (
    <>
      <GeometriesList
        selectedGeometries={p.selectedGeometries}
        setSelectedGeometries={p.setSelectedGeometries}
        geometries={p.displayedGeometries}
      />
      <PointsList
        selectedPoints={p.selectedPoints}
        setSelectedPoints={p.setSelectedPoints}
        points={p.displayedPoints}
        step={p.step}
        hideHeader
      />
    </>
  );
}
