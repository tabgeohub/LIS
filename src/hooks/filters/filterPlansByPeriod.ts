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

function matchesLastFourWeeks(planDate: string, now: Date): boolean {
  const fourWeeksAgo = new Date(now);
  fourWeeksAgo.setDate(now.getDate() - 28);
  return new Date(planDate) >= fourWeeksAgo;
}

function matchesDateRange(
  planDate: string,
  dateFrom: string,
  dateTo: string
): boolean {
  const d = new Date(planDate);
  return d >= new Date(dateFrom) && d <= new Date(dateTo);
}

function isVanTotPeriod(input: {
  periodFilter?: string;
  dateFrom?: string;
  dateTo?: string;
}): input is { periodFilter: string; dateFrom: string; dateTo: string } {
  return (
    input.periodFilter === "Periodoe van-tot" &&
    Boolean(input.dateFrom) &&
    Boolean(input.dateTo)
  );
}

function matchesPeriod(input: {
  planDate: string;
  periodFilter?: string;
  dateFrom?: string;
  dateTo?: string;
  now: Date;
}): boolean {
  if (input.periodFilter === "Laatste 4 weken") {
    return matchesLastFourWeeks(input.planDate, input.now);
  }

  if (isVanTotPeriod(input)) {
    return matchesDateRange(input.planDate, input.dateFrom, input.dateTo);
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
