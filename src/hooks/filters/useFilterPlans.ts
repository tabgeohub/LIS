import { FlightPlanType } from "Types";

export function useFilterPlans() {
  function filterPlans(
    setFilteredPlans: (value: FlightPlanType[]) => void,
    plans: FlightPlanType[],
    filterText?: string,
    dateFrom?: string,
    dateTo?: string,
    periodFilter?: string
  ) {
    const now = new Date();

    if (periodFilter === "Alle") return setFilteredPlans(plans);

    const filteredPlans = plans.filter((plan) => {
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
      )
        return false;

      return true;
    });

    // @ts-ignore
    setFilteredPlans(filteredPlans);
  }

  return filterPlans;
}
