import type { UserType } from "Types";

export const VIEWER_ONLY_MESSAGE =
  "U heeft alleen leesrechten (intern). Wijzigingen zijn niet toegestaan.";

/** Thrown when a viewer-only user triggers a write; callers stay silent on it. */
export class ViewerBlockedError extends Error {
  constructor() {
    super(VIEWER_ONLY_MESSAGE);
    this.name = "ViewerBlockedError";
  }
}

export function isViewerBlockedError(error: unknown): boolean {
  return error instanceof ViewerBlockedError;
}

/** Intern affiliation = view-only across the app. */
export function isViewerOnly(
  user: Pick<UserType, "affiliation"> | null | undefined
): boolean {
  return user?.affiliation === "intern";
}

export function canEdit(
  user: Pick<UserType, "affiliation"> | null | undefined
): boolean {
  return !isViewerOnly(user);
}

export function assertCanEdit(
  user: Pick<UserType, "affiliation"> | null | undefined
): void {
  if (isViewerOnly(user)) {
    throw new ViewerBlockedError();
  }
}

/** Head tabs intern users may open (everything else is locked). */
export const VIEWER_ALLOWED_TAB_IDS = new Set<string>([
  "viewPlan",
  "vluchtZoeken",
  "waarnemings",
  "timeslider",
  "aandachtspuntenFilteren",
  "bevragen",
  "exporteer",
]);

export function applyViewerTabLocks<T extends { id: string; disabled: boolean }>(
  tabs: T[],
  userCanEdit: boolean
): T[] {
  if (userCanEdit) return tabs;
  return tabs.map((tab) => ({
    ...tab,
    disabled: tab.disabled || !VIEWER_ALLOWED_TAB_IDS.has(tab.id),
  }));
}
