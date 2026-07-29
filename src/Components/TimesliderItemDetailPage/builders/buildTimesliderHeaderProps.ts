import type { BuildTimesliderPageShellInput } from "./timesliderPageShellTypes";

function resolveItemName(input: {
  invalidQuery: boolean;
  queryError: string | null | undefined;
  displayTitle: string;
}): string {
  if (input.invalidQuery) return input.queryError ?? "Ongeldige link";
  return input.displayTitle || "—";
}

function resolveVluchtnummer(input: {
  invalidQuery: boolean;
  vluchtnummer: string | null | undefined;
}): string | null {
  if (input.invalidQuery) return null;
  return input.vluchtnummer ?? null;
}

/** Header props for the timeslider detail page shell. */
export function buildTimesliderHeaderProps(input: BuildTimesliderPageShellInput) {
  const { invalidQuery, queryError, displayTitle, selectedPlan, from, to } =
    input.data;

  return {
    itemName: resolveItemName({ invalidQuery, queryError, displayTitle }),
    vluchtnummer: resolveVluchtnummer({
      invalidQuery,
      vluchtnummer: selectedPlan?.vluchtnummer,
    }),
    dateFrom: from,
    dateTo: to,
    onAllPlansClick: () =>
      input.setPlansSectionVisible((visible) => !visible),
  };
}
