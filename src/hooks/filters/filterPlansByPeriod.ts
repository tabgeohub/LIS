export type PlanWithDatumAndVluchtnummer = {
  datum: string;
  vluchtnummer: string;
};

export function filterPlansByPeriod<T extends PlanWithDatumAndVluchtnummer>(
  plans: T[],
  filterText?: string,
  dateFrom?: string,
  dateTo?: string,
  periodFilter?: string
): T[] {
  const now = new Date();

  if (periodFilter === "Alle" || periodFilter === "alle") {
    return plans;
  }

  return plans.filter((plan) => {
    if (periodFilter === "Laatste 4 weken") {
      const planDate = new Date(plan.datum);
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(now.getDate() - 28);
      if (planDate < fourWeeksAgo) return false;
    } else if (periodFilter === "Periodoe van-tot" && dateFrom && dateTo) {
      const planDate = new Date(plan.datum);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      if (planDate < fromDate || planDate > toDate) return false;
    }

    if (
      filterText &&
      filterText.trim() !== "" &&
      !plan.vluchtnummer.toLowerCase().includes(filterText.toLowerCase())
    ) {
      return false;
    }

    return true;
  });
}
