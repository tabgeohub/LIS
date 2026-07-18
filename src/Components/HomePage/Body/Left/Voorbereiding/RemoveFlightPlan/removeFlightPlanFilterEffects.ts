/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { FlightPlanType } from "Types";

export function useRemoveFlightPlanFilterEffects(input: {
  plans: FlightPlanType[];
  filterTerm: string;
  setFilteredPlans: (plans: FlightPlanType[]) => void;
  setFilterTerm: (term: string) => void;
  filterPlans: (args: {
    setFilteredPlans: (plans: FlightPlanType[]) => void;
    plans: FlightPlanType[];
    filterText: string;
  }) => void;
}) {
  const { plans, filterTerm, setFilteredPlans, setFilterTerm, filterPlans } =
    input;

  useEffect(() => {
    if (!plans) return;
    setFilteredPlans(
      plans.filter((plan: FlightPlanType) =>
        plan.vluchtnummer.toLowerCase().includes(filterTerm.toLowerCase())
      )
    );
  }, [plans]);

  useEffect(() => {
    if (!plans) return;
    filterPlans({ setFilteredPlans, plans, filterText: filterTerm });
  }, [filterTerm]);

  useEffect(() => {
    setFilterTerm("");
  }, []);
}

export function visibleRemovePlans(
  plans: FlightPlanType[] | undefined,
  showAllPlans: boolean
) {
  if (showAllPlans) return plans;
  return plans?.filter(
    (plan) => plan.status !== "finished" && plan.status !== "in-progress"
  );
}
