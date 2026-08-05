/** Shared log message when a user selects a flight plan from a list. */
export function logFlightPlanRowClick(
  logAction: (input: { message: string; step: string }) => void,
  vluchtnummer: string
): void {
  logAction({
    message: `User clicked on flight plan ${vluchtnummer}`,
    step: "First step",
  });
}
