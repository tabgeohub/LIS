export const POPUP_BLOCKED_TABS = new Set([
  "enrichedAddPoint",
  "flightPlan",
  "templateFlights",
  "addPoint",
  "verwijderen",
]);

export function isPopupTabBlocked(tab: string) {
  return POPUP_BLOCKED_TABS.has(tab);
}
