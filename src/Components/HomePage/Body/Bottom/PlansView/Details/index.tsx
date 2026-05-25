import { haversine } from "@helpers/haversine";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useContent } from "hooks/useContent";
import { useEffect, useState } from "react";
import { useFinishedPlanPath } from "api-hooks/finishedPlans";

type DetailFieldProps = {
  label: string;
  value: string | number | null | undefined;
};

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="mb-2">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium">{value ?? "-"}</div>
    </div>
  );
}

export default function Details() {
  const { flightPlanData } = useOpenTable();
  const content = useContent();

  const { data: planPathRaw } = useFinishedPlanPath(flightPlanData?.id);
  const planPath = Array.isArray(planPathRaw)
    ? planPathRaw
    : planPathRaw
      ? [planPathRaw]
      : undefined;

  const [beginTime, setBeginTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
  const [totalDistance, setTotalDistance] = useState<number | null>(null);

  useEffect(() => {
    if (!planPath || !planPath?.[0]) return;

    const pathPoints = planPath[0].path;

    if (pathPoints.length >= 2) {
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
    }

    // Calculate flighttime
    if (
      !planPath[0] ||
      !planPath[0].flighttime ||
      planPath[0].flighttime.length === 0
    )
      return;
    const flighttimes = planPath[0].flighttime.filter(
      (item) => item.action === "start"
    );

    if (flighttimes.length >= 1) {
      const startTimestamps = flighttimes.map((item) => item.time).sort();
      const beginTimestamp = startTimestamps[0];
      const endTimestamp = startTimestamps[startTimestamps.length - 1];

      setBeginTime(new Date(beginTimestamp).toLocaleString());
      setEndTime(new Date(endTimestamp).toLocaleString());
      setDurationSeconds(
        Math.round((endTimestamp - beginTimestamp) / 1000 / 60)
      );
    }
  }, [planPath]);

  if (!flightPlanData) return null;

  return (
    <div className="w-full h-full p-4 overflow-y-auto">
      <div className="grid grid-cols-3 gap-6 text-sm">
        <div>
          <DetailField
            label={content.bottomSection.plansView.details.createdBy}
            value={flightPlanData.user_id}
          />

          <DetailField
            label={content.bottomSection.plansView.details.createdAt}
            value={flightPlanData.datum}
          />

          <DetailField
            label={content.bottomSection.plansView.details.flightNumber}
            value={flightPlanData.vluchtnummer}
          />

          <DetailField
            label={content.bottomSection.plansView.details.description}
            value={flightPlanData.omschrijving}
          />

          <DetailField
            label={content.bottomSection.plansView.details.observer}
            value={flightPlanData.waarnemer}
          />

          <DetailField
            label={content.bottomSection.plansView.details.pilot}
            value={flightPlanData.piloot}
          />
        </div>

        <div>
          <DetailField
            label={content.bottomSection.plansView.details.inspectionDate}
            value={flightPlanData.datum}
          />

          <DetailField
            label={content.bottomSection.plansView.details.aircraft}
            value={flightPlanData.luchtvaartuig}
          />

          <DetailField
            label={content.bottomSection.plansView.details.region}
            value={flightPlanData.regio_id}
          />

          <DetailField
            label={content.bottomSection.plansView.details.passengers}
            value={flightPlanData.passagiers}
          />

          <DetailField
            label={content.bottomSection.plansView.details.goalTheme}
            value={flightPlanData.hoofdthema}
          />

          <DetailField
            label={content.bottomSection.plansView.details.additionalInfo}
            value={flightPlanData.aanvullende}
          />
        </div>

        <div>
          <DetailField
            label={content.bottomSection.plansView.details.beginTime}
            value={beginTime}
          />

          <DetailField
            label={content.bottomSection.plansView.details.endTime}
            value={endTime}
          />

          <DetailField
            label={content.bottomSection.plansView.details.actualDuration}
            value={durationSeconds}
          />

          <DetailField
            label={content.bottomSection.plansView.details.distance}
            value={totalDistance}
          />

          <DetailField
            label={content.bottomSection.plansView.details.status}
            value={flightPlanData.status}
          />
        </div>
      </div>
    </div>
  );
}
