import { FlightPlanType } from "Types";

export function filterPlans(
  initialPlans: FlightPlanType[],
  filterInput: string,
  dateVan: string,
  dateTot: string
) {
  const lowerCaseFilterInput = filterInput.toLowerCase();
  const filtered = initialPlans.filter((plan) => {
    const withinDateRange =
      dateVan !== "" && dateTot !== ""
        ? plan.datum >= dateVan && plan.datum <= dateTot
        : true;
    const matchesName = plan.vluchtnummer
      .toLowerCase()
      .includes(lowerCaseFilterInput);
    return withinDateRange && matchesName;
  });

  return filtered;
}
