import { FinishedGeometryType } from "Types/finished_plans";
import { TbLine, TbPolygon } from "react-icons/tb";
import useGeometryHover from "hooks/hover-click-handlers/useGeometryHover";

interface GeometriesProps {
  geometries: FinishedGeometryType[];
  selectedGeometries: number[];
  onSelectGeometry: (geometry: FinishedGeometryType) => void;
  onFocusGeometry: (geometryId: number) => void;
}

export default function Geometries({
  geometries,
  selectedGeometries,
  onSelectGeometry,
  onFocusGeometry,
}: GeometriesProps) {
  const {
    handleHoveredGeometry,
    handleRemoveHoveredGeometry,
  } = useGeometryHover();

  return (
    <>
      {geometries.map((geometry) => (
        <div
          className={`flex items-center space-x-3 p-2 py-1 hover:bg-gray-100 transition-all duration-300 ${
            selectedGeometries.includes(geometry.id) && "bg-gray-200"
          }`}
          key={geometry.id}
          onMouseEnter={() => handleHoveredGeometry(geometry)}
          onMouseLeave={handleRemoveHoveredGeometry}
        >
          <input
            type="checkbox"
            className="h-[12px] w-[12px] cursor-pointer"
            onClick={() => onSelectGeometry(geometry)}
            checked={selectedGeometries.includes(geometry.id)}
          />
          <div
            onClick={() => onFocusGeometry(geometry.id)}
            className="flex items-center space-x-1 w-full cursor-pointer"
          >
            {geometry.geometry_type === "polygon" ? (
              <TbPolygon className="size-4 text-yellow-500" />
            ) : (
              <TbLine className="size-4 text-green-500" />
            )}
            <p>
              {geometry.geometry_omschrijving || `Geometrie ${geometry.id}`}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}



