import type { UserType } from "Types";

export const VIEWER_ONLY_MESSAGE =
  "U heeft alleen leesrechten (intern). Wijzigingen zijn niet toegestaan.";

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
    throw new Error(VIEWER_ONLY_MESSAGE);
  }
}

/** Head tabs intern users may open (everything else is locked). */
export const VIEWER_ALLOWED_TAB_IDS = new Set<string>([
  "viewPlan",
  "vluchtZoeken",
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
