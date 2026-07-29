import { Geometry } from "hooks/features";
import { GeometryItemCheckBox } from "./GeometryItemCheckBox";

export function GeometriesListItems(input: {
  sortedGeometries: Geometry[];
  safeSelectedGeometries: number[];
  onHover: (geometry: Geometry) => void;
  onLeave: () => void;
  onToggle: (geometry: Geometry) => void;
  onSelectOnly: (id: number) => void;
}) {
  return (
    <>
      {input.sortedGeometries.map((geometry) => (
        <GeometryItemCheckBox
          key={geometry.id}
          geometry={geometry}
          isSelected={input.safeSelectedGeometries.includes(geometry.id)}
          onMouseEnter={() => input.onHover(geometry)}
          onMouseLeave={input.onLeave}
          onCheckboxClick={(e) => {
            e.stopPropagation();
            input.onToggle(geometry);
          }}
          onItemClick={() => input.onSelectOnly(geometry.id)}
        />
      ))}
    </>
  );
}
