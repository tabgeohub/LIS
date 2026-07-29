import type { AttachmentType } from "Types/finished_plans";

export function sortPlanAttachments(
  attachments: AttachmentType[]
): AttachmentType[] {
  return [...attachments].sort(
    (first, second) => (first.taken_at || 0) - (second.taken_at || 0)
  );
}

export function resolvePlanImagesState(input: {
  isFinished: boolean;
  isLoading: boolean;
  attachments?: AttachmentType[];
}):
  | { kind: "hidden" }
  | { kind: "loading" }
  | { kind: "empty" }
  | { kind: "ready"; attachments: AttachmentType[] } {
  if (!input.isFinished) return { kind: "hidden" };
  if (input.isLoading || !input.attachments) return { kind: "loading" };
  if (input.attachments.length === 0) return { kind: "empty" };
  return { kind: "ready", attachments: sortPlanAttachments(input.attachments) };
}
