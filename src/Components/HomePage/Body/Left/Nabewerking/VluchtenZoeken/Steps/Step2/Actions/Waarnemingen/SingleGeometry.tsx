import { TbLine, TbPolygon } from "react-icons/tb";
import { IoMdImage } from "react-icons/io";
import { FinishedGeometryType } from "Types/finished_plans";
import useLogAction from "hooks/useLogAction";
import useGeometryClick from "hooks/hover-click-handlers/useGeometryClick";
import useGeometryHover from "hooks/hover-click-handlers/useGeometryHover";

export default function SingleGeometry({
  geometry,
  selectedGeometry,
  setSelectedGeometry,
}: {
  geometry: FinishedGeometryType;
  selectedGeometry: FinishedGeometryType | null;
  setSelectedGeometry: (value: FinishedGeometryType) => void;
}) {
  const { handleHoveredGeometry, handleRemoveHoveredGeometry } =
    useGeometryHover();

  useGeometryClick({ selectedGeometry });

  const logAction = useLogAction();

  const geometryTypeLabel =
    geometry.geometry_type === "polygon" ? "Veelhoek" : "Lijn";

  const firstPoint = geometry.points?.[0];
  const hasAttachments =
    firstPoint?.attachments &&
    firstPoint.attachments[0] !== null &&
    firstPoint.attachments.length > 0;
  const attachmentCount = firstPoint?.attachments?.length || 0;

  return (
    <div
      onMouseEnter={() => {
        handleHoveredGeometry(geometry);
      }}
      onMouseLeave={handleRemoveHoveredGeometry}
      className={`p-1.5 relative ${
        selectedGeometry?.id === geometry.id ? "bg-gray-100" : "hover:bg-gray-50"
      } transition-all cursor-pointer`}
      onClick={() => {
        setSelectedGeometry(geometry);

        logAction({
          message: `User clicked on geometry ${geometry.geometry_omschrijving}`,
          step: "Second step - Edit point",
        });
      }}
    >
      <div className="flex items-center gap-x-2">
        {geometry.geometry_type === "polygon" ? (
          <TbPolygon className="size-6 text-yellow-500" />
        ) : (
          <TbLine className="size-6 text-green-500" />
        )}
        <p className="text-[12px]">
          {geometry.geometry_omschrijving || `Geometrie ${geometry.id}`}
        </p>
      </div>

      <div className="text-[10px] text-gray-500 mt-2">
        <p>Type: {geometryTypeLabel}</p>
        <p>Aantal punten: {geometry.points?.length || 0}</p>

        <p>Organisatie: {geometry.points.at(0)?.organisatie_id}</p>
        <p>Specifiek letten op: {geometry.points.at(0)?.specifiek_letten_op}</p>
        <p>Activiteit: {geometry.points.at(0)?.activiteit_id}</p>
      </div>

      {hasAttachments && (
        <div className="absolute mt-4 bottom-0 right-4">
          <IoMdImage className="size-4 text-gray-500" />
          <div className="absolute bottom-2 -right-3 bg-[#3B82F6] rounded-full px-1 text-white text-[10px]">
            {attachmentCount}
          </div>
        </div>
      )}
    </div>
  );
}
