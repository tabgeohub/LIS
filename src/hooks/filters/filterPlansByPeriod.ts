export type PlanWithDatumAndVluchtnummer = {
  datum: string;
  vluchtnummer: string;
};

export type FilterPlansByPeriodInput<T extends PlanWithDatumAndVluchtnummer> = {
  plans: T[];
  filterText?: string;
  dateFrom?: string;
  dateTo?: string;
  periodFilter?: string;
};

function matchesPeriod(input: {
  planDate: string;
  periodFilter?: string;
  dateFrom?: string;
  dateTo?: string;
  now: Date;
}): boolean {
  if (input.periodFilter === "Laatste 4 weken") {
    const fourWeeksAgo = new Date(input.now);
    fourWeeksAgo.setDate(input.now.getDate() - 28);
    return new Date(input.planDate) >= fourWeeksAgo;
  }

  if (
    input.periodFilter === "Periodoe van-tot" &&
    input.dateFrom &&
    input.dateTo
  ) {
    const planDate = new Date(input.planDate);
    return planDate >= new Date(input.dateFrom) && planDate <= new Date(input.dateTo);
  }

  return true;
}

function matchesFlightNumber(vluchtnummer: string, filterText?: string): boolean {
  const term = filterText?.trim().toLowerCase();
  return !term || vluchtnummer.toLowerCase().includes(term);
}

export function filterPlansByPeriod<T extends PlanWithDatumAndVluchtnummer>(
  input: FilterPlansByPeriodInput<T>
): T[] {
  const { plans, filterText, dateFrom, dateTo, periodFilter } = input;
  const now = new Date();

  if (periodFilter === "Alle" || periodFilter === "alle") {
    return plans;
  }

  return plans.filter((plan) => {
    return (
      matchesPeriod({
        planDate: plan.datum,
        periodFilter,
        dateFrom,
        dateTo,
        now,
      }) && matchesFlightNumber(plan.vluchtnummer, filterText)
    );
  });
}
