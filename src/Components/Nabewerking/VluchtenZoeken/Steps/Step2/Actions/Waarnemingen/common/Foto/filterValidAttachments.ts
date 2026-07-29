import { AttachmentType } from "Types/finished_plans";

export type FilterValidAttachmentsOptions = {
  attachments: (AttachmentType | null)[] | undefined;
};

function isValidAttachment(
  attachment: AttachmentType | null
): attachment is AttachmentType {
  if (attachment === null) return false;
  if (typeof attachment !== "object") return false;
  if (typeof attachment.url !== "string") return false;
  return attachment.url.length > 0;
}

export function filterValidAttachments(
  options: FilterValidAttachmentsOptions
): AttachmentType[] {
  return (options.attachments ?? []).filter(isValidAttachment);
}
