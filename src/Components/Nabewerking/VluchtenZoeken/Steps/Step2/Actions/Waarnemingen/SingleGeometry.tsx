import { FinishedGeometryType } from "Types/finished_plans";
import useLogAction from "hooks/useLogAction";
import useGeometryClick from "Components/HomePage/hooks/hover-click-handlers/useGeometryClick";
import useGeometryListHover from "Components/HomePage/hooks/hover-click-handlers/useGeometryListHover";
import { SingleGeometryCardBody } from "./SingleGeometryCardBody";

type Props = {
  geometry: FinishedGeometryType;
  selectedGeometry: FinishedGeometryType | null;
  setSelectedGeometry: (value: FinishedGeometryType) => void;
};

export default function SingleGeometry({
  geometry,
  selectedGeometry,
  setSelectedGeometry,
}: Props) {
  const { handleHoveredGeometry, handleRemoveHoveredGeometry } =
    useGeometryListHover();
  useGeometryClick({ selectedGeometry });
  const logAction = useLogAction();
  const selected = selectedGeometry?.id === geometry.id;

  return (
    <div
      onMouseEnter={() => handleHoveredGeometry(geometry)}
      onMouseLeave={handleRemoveHoveredGeometry}
      className={`p-1.5 relative ${selected ? "bg-gray-100" : "hover:bg-gray-50"} transition-all cursor-pointer`}
      onClick={() => {
        setSelectedGeometry(geometry);
        logAction({
          message: `User clicked on geometry ${geometry.geometry_omschrijving}`,
          step: "Second step - Edit point",
        });
      }}
    >
      <SingleGeometryCardBody geometry={geometry} />
    </div>
  );
}
