import { FinishedGeometryType } from "Types/finished_plans";

export function geometryHasAttachments(geometry: FinishedGeometryType) {
  const firstPoint = geometry.points?.[0];
  const hasAttachments =
    !!firstPoint?.attachments &&
    firstPoint.attachments[0] !== null &&
    firstPoint.attachments.length > 0;
  return {
    hasAttachments,
    attachmentCount: firstPoint?.attachments?.length || 0,
  };
}

export function GeometryDetailLines({
  geometry,
}: {
  geometry: FinishedGeometryType;
}) {
  const geometryTypeLabel =
    geometry.geometry_type === "polygon" ? "Veelhoek" : "Lijn";
  return (
    <div className="text-[10px] text-gray-500 mt-2">
      <p>Type: {geometryTypeLabel}</p>
      <p>Aantal punten: {geometry.points?.length || 0}</p>
      <p>Organisatie: {geometry.points.at(0)?.organisatie_id}</p>
      <p>Specifiek letten op: {geometry.points.at(0)?.specifiek_letten_op}</p>
      <p>Activiteit: {geometry.points.at(0)?.activiteit_id}</p>
    </div>
  );
}
