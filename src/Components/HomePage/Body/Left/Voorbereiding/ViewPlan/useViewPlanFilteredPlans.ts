import { useEffect } from "react";
import { filterPlans } from "@helpers/filterPlans";
import type { FlightPlanType } from "Types";

export function useViewPlanFilteredPlans(input: {
  initialPlans: FlightPlanType[];
  flightPlans: FlightPlanType[];
  filterInput: string;
  dateVan: string;
  dateTot: string;
  setFilteredPlans: (plans: FlightPlanType[]) => void;
  setFilterInput: (value: string) => void;
}) {
  useEffect(() => {
    if (!input.initialPlans.length && !input.flightPlans.length) return;
    input.setFilteredPlans(
      filterPlans({
        initialPlans: input.initialPlans,
        filterInput: input.filterInput,
        dateVan: input.dateVan,
        dateTot: input.dateTot,
      })
    );
  }, [
    input.dateVan,
    input.dateTot,
    input.filterInput,
    input.initialPlans,
    input.flightPlans.length,
    input.setFilteredPlans,
  ]);

  useEffect(() => {
    input.setFilterInput("");
  }, [input.setFilterInput]);
}
