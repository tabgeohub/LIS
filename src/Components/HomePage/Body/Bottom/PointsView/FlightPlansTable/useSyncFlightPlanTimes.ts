/* eslint-disable react-hooks/exhaustive-deps */
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useGetFlightTimesDistance } from "hooks/useGetFlightTimesDistance";
import { useEffect } from "react";
import { FlightPlanType } from "Types";

export function useSyncFlightPlanTimes(plan: FlightPlanType) {
  const { flightPlans, setFlightPlans } = useOpenTable();
  const { beginTime, endTime, durationSeconds, totalDistance } =
    useGetFlightTimesDistance(plan);

  useEffect(() => {
    if (!beginTime || !endTime || !durationSeconds || !totalDistance) return;
    setFlightPlans(
      flightPlans.map((fp) =>
        fp.id === plan.id
          ? { ...fp, beginTime, endTime, durationSeconds, totalDistance }
          : fp
      )
    );
  }, [beginTime, endTime, durationSeconds, totalDistance]);
}
