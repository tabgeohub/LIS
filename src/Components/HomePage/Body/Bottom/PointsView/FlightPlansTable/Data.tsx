/* eslint-disable react-hooks/exhaustive-deps */
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useGetFlightTimesDistance } from "hooks/useGetFlightTimesDistance";
import { useEffect } from "react";
import { FlightPlanType } from "Types";

export default function Data({
  plan,
  visibleColumnsPlans,
}: {
  plan: FlightPlanType;
  visibleColumnsPlans: string[];
}) {
  const { flightPlans, setFlightPlans } = useOpenTable();

  const { beginTime, endTime, durationSeconds, totalDistance } =
    useGetFlightTimesDistance(plan);

  useEffect(() => {
    if (!beginTime || !endTime || !durationSeconds || !totalDistance) return;

    const updatedPlans = flightPlans.map((fp) =>
      fp.id === plan.id
        ? {
            ...fp,
            beginTime,
            endTime,
            durationSeconds,
            totalDistance,
          }
        : fp
    );

    setFlightPlans(updatedPlans);
  }, [beginTime, endTime, durationSeconds, totalDistance]);

  return (
    <>
      {visibleColumnsPlans.map((col) => {
        const keyMap: Record<string, keyof FlightPlanType> = {
          "aanmaker vlieplan": "user_id",
          "aanmaker datum": "datum",
          vluchtnummer: "vluchtnummer",
          omschrijving: "omschrijving",
          waarnemer: "waarnemer",
          piloot: "piloot",
          inspectiedatum: "datum",
          regio: "regio_id",
          "aantal passagiers": "passagiers",
          "doel en hoofdthema": "hoofdthema",
          "aanvullende informatie": "aanvullende",
          "geplande vliegduur": "vliegduur",
          status: "status",
          "begintijd en datum": "startTime",
          "eindtijd en datum": "endTime",
          "werkelijke vliegduur": "spoed",
          "gevlogen afstand": "flightDuration",
        };

        const dbKey = keyMap[col.toLowerCase()] || col.toLowerCase();

        return (
          <td key={col} className="px-2 py-4 whitespace-nowrap">
            {(() => {
              const value = plan[dbKey as keyof typeof plan];

              if (value === null || value === undefined) return "-";

              if (typeof value === "object") return JSON.stringify(value);

              return value;
            })()}
          </td>
        );
      })}
    </>
  );
}
