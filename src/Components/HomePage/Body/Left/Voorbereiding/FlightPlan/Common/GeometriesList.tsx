import { Geometry } from "hooks/features/useGeometriesStore";
import { GeometriesListItems } from "./GeometriesListItems";
import { useGeometriesListModel } from "./useGeometriesListModel";

export default function GeometriesList({
  selectedGeometries,
  setSelectedGeometries,
  geometries,
}: {
  selectedGeometries: number[];
  setSelectedGeometries: (value: number[]) => void;
  geometries: Geometry[];
}) {
  const model = useGeometriesListModel({
    selectedGeometries,
    setSelectedGeometries,
    geometries,
  });

  return (
    <GeometriesListItems
      sortedGeometries={model.sortedGeometries}
      safeSelectedGeometries={model.safeSelectedGeometries}
      onHover={model.hover.handleHoveredGeometry}
      onLeave={model.hover.handleRemoveHoveredGeometry}
      onToggle={model.handleGeometryClick}
      onSelectOnly={model.selectOnly}
    />
  );
}
