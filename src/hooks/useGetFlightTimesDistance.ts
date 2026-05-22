import { haversine } from "@helpers/haversine";
import { useEffect, useState } from "react";
import { useReadData } from "utils/useReadData";

export function useGetFlightTimesDistance(flightPlan: any) {
  const { data: planPath } = useReadData<
    {
      path?: { latitude: number; longitude: number }[] | null;
      flighttime?: { time: number; action: string }[] | null;
    }[]
  >(`/finished_plans/getPlanPath/${flightPlan?.id}`);

  const [beginTime, setBeginTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
  const [totalDistance, setTotalDistance] = useState<number | null>(null);

  useEffect(() => {
    if (!planPath?.[0]) {
      setBeginTime(null);
      setEndTime(null);
      setDurationSeconds(null);
      setTotalDistance(null);
      return;
    }

    const row = planPath[0];
    const pathPoints = row.path;

    if (Array.isArray(pathPoints) && pathPoints.length >= 2) {
      let distanceSum = 0;
      for (let i = 1; i < pathPoints.length; i++) {
        const p1 = pathPoints[i - 1];
        const p2 = pathPoints[i];
        distanceSum += haversine(
          p1.latitude,
          p1.longitude,
          p2.latitude,
          p2.longitude
        );
      }
      setTotalDistance(distanceSum);
    } else {
      setTotalDistance(null);
    }

    if (!row.flighttime || !Array.isArray(row.flighttime) || row.flighttime.length === 0) {
      setBeginTime(null);
      setEndTime(null);
      setDurationSeconds(null);
      return;
    }

    const flighttimes = row.flighttime.filter((item) => item.action === "start");

    if (flighttimes.length >= 1) {
      const startTimestamps = flighttimes.map((item) => item.time).sort();
      const beginTimestamp = startTimestamps[0];
      const endTimestamp = startTimestamps[startTimestamps.length - 1];

      setBeginTime(new Date(beginTimestamp).toLocaleString());
      setEndTime(new Date(endTimestamp).toLocaleString());
      setDurationSeconds(
        Math.round((endTimestamp - beginTimestamp) / 1000 / 60)
      );
    } else {
      setBeginTime(null);
      setEndTime(null);
      setDurationSeconds(null);
    }
  }, [planPath]);

  return {
    beginTime,
    endTime,
    durationSeconds,
    totalDistance,
  };
}
