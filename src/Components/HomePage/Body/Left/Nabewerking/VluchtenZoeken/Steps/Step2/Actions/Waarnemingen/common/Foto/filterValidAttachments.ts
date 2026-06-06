import { AttachmentType } from "Types/finished_plans";

export function filterValidAttachments(
  attachments: (AttachmentType | null)[] | undefined
): AttachmentType[] {
  return (attachments ?? []).filter(
    (attachment): attachment is AttachmentType =>
      attachment !== null &&
      typeof attachment === "object" &&
      typeof attachment.url === "string" &&
      attachment.url.length > 0
  );
}
