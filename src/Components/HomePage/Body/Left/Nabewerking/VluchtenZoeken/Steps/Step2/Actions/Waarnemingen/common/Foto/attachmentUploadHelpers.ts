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

export function buildAttachmentFromUploadResponse(input: {
  objectId: number;
  responseId: number;
  responseUrl: string;
  pointId: number;
  takenAt: number;
}) {
  return {
    attachmentid: Number(input.objectId),
    id: Number(input.responseId),
    point_id: Number(input.pointId),
    taken_at: Number(input.takenAt),
    url: input.responseUrl,
  };
}
