import type { AttachmentType } from "Types/finished_plans";

function findClickedFotoMarkerGraphic(
  hitTestResult: __esri.HitTestResult
): __esri.Graphic | undefined {
  return hitTestResult.results
    .filter(
      (result): result is __esri.GraphicHit =>
        result.type === "graphic" &&
        (result as __esri.GraphicHit).graphic !== undefined
    )
    .map((result) => (result as __esri.GraphicHit).graphic)
    .find(
      (graphic) =>
        graphic?.attributes?.type === "image-numbered-marker" ||
        graphic?.attributes?.type === "image-numbered-marker-label"
    );
}

function indexOfAttachmentById(
  validAttachments: AttachmentType[],
  attachmentId: unknown
): number | null {
  if (attachmentId === undefined) return null;
  const sortedIndex = [...validAttachments]
    .sort((a, b) => a.taken_at - b.taken_at)
    .findIndex((att) => att.id === attachmentId);
  return sortedIndex === -1 ? null : sortedIndex;
}

export async function findFotoMarkerAttachmentIndex(
  hitTestResult: __esri.HitTestResult,
  validAttachments: AttachmentType[]
): Promise<number | null> {
  const clickedGraphic = findClickedFotoMarkerGraphic(hitTestResult);
  if (!clickedGraphic) return null;
  return indexOfAttachmentById(
    validAttachments,
    clickedGraphic.attributes?.attachmentId
  );
}
