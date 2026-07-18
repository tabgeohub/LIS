import { TbLine, TbPolygon } from "react-icons/tb";
import { IoMdImage } from "react-icons/io";
import { FinishedGeometryType } from "Types/finished_plans";
import {
  GeometryDetailLines,
  geometryHasAttachments,
} from "./singleGeometryHelpers";

export function SingleGeometryCardBody({
  geometry,
}: {
  geometry: FinishedGeometryType;
}) {
  const { hasAttachments, attachmentCount } = geometryHasAttachments(geometry);
  return (
    <>
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
      <GeometryDetailLines geometry={geometry} />
      {hasAttachments && (
        <div className="absolute mt-4 bottom-0 right-4">
          <IoMdImage className="size-4 text-gray-500" />
          <div className="absolute bottom-2 -right-3 bg-[#3B82F6] rounded-full px-1 text-white text-[10px]">
            {attachmentCount}
          </div>
        </div>
      )}
    </>
  );
}
