import type { BuildTimesliderPageShellInput } from "./timesliderPageShellTypes";

/** Header props for the timeslider detail page shell. */
export function buildTimesliderHeaderProps(input: BuildTimesliderPageShellInput) {
  const { invalidQuery, queryError, displayTitle, selectedPlan, from, to } =
    input.data;

  return {
    itemName: invalidQuery
      ? (queryError ?? "Ongeldige link")
      : displayTitle || "—",
    vluchtnummer: invalidQuery ? null : (selectedPlan?.vluchtnummer ?? null),
    dateFrom: from,
    dateTo: to,
    onAllPlansClick: () =>
      input.setPlansSectionVisible((visible) => !visible),
  };
}
