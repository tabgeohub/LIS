import { describe, expect, it } from "vitest";
import type { AttachmentType } from "Types/finished_plans";
import { resolvePlanImagesState, sortPlanAttachments } from "./planImagesState";

const attachments = [
  { id: 1, url: "one", taken_at: 20 },
  { id: 2, url: "two", taken_at: 0 },
  { id: 3, url: "three", taken_at: 10 },
] as AttachmentType[];

describe("plan image state", () => {
  it("sorts attachments by taken_at without mutating the response", () => {
    expect(sortPlanAttachments(attachments).map(({ id }) => id)).toEqual([2, 3, 1]);
    expect(attachments.map(({ id }) => id)).toEqual([1, 2, 3]);
  });

  it("distinguishes unfinished, loading, empty and ready states", () => {
    expect(resolvePlanImagesState({ isFinished: false, isLoading: false, attachments })).toEqual({ kind: "hidden" });
    expect(resolvePlanImagesState({ isFinished: true, isLoading: true })).toEqual({ kind: "loading" });
    expect(resolvePlanImagesState({ isFinished: true, isLoading: false, attachments: [] })).toEqual({ kind: "empty" });
    expect(resolvePlanImagesState({ isFinished: true, isLoading: false, attachments })).toEqual({
      kind: "ready",
      attachments: [attachments[1], attachments[2], attachments[0]],
    });
  });
});
