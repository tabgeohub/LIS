import { base64ToBlob } from "@helpers/base64ToBlob";

export function readImageFileAsBlob(
  file: File,
  onReady: (image: { image: Blob; timestamp: number }) => void
) {
  const reader = new FileReader();

  reader.onload = () => {
    if (reader.result) {
      const base64Image = reader.result as string;
      const blob = base64ToBlob(base64Image);
      onReady({ image: blob, timestamp: Date.now() });
    }
  };

  reader.readAsDataURL(file);
}

export function buildAttachmentFromUploadResponse(
  objectId: number,
  responseId: number,
  responseUrl: string,
  pointId: number,
  takenAt: number
) {
  return {
    attachmentid: Number(objectId),
    id: Number(responseId),
    point_id: Number(pointId),
    taken_at: Number(takenAt),
    url: responseUrl,
  };
}
