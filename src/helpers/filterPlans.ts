import { FlightPlanType } from "Types";

export type FilterPlansByDateInput = {
  initialPlans: FlightPlanType[];
  filterInput: string;
  dateVan: string;
  dateTot: string;
};

export function filterPlans(input: FilterPlansByDateInput) {
  const { initialPlans, filterInput, dateVan, dateTot } = input;
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
