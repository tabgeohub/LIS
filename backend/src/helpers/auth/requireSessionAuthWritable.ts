import type { RequestHandler } from "express";
import { rejectViewerMutations } from "./rejectViewerMutations";
import { requireSessionAuth } from "./requireSessionAuth";

/** Session auth + block writes for intern (viewer-only) users. */
export const requireSessionAuthWritable: RequestHandler[] = [
  requireSessionAuth,
  rejectViewerMutations,
];
