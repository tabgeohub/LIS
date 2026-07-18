/* eslint-disable react-hooks/exhaustive-deps */
import { FlightPlanType } from "Types";
import { formatFlightPlanCellValue } from "./flightPlanColumnHelpers";
import { useSyncFlightPlanTimes } from "./useSyncFlightPlanTimes";

export default function Data({
  plan,
  visibleColumnsPlans,
}: {
  plan: FlightPlanType;
  visibleColumnsPlans: string[];
}) {
  useSyncFlightPlanTimes(plan);

  return (
    <>
      {visibleColumnsPlans.map((col) => (
        <td key={col} className="px-2 py-4 whitespace-nowrap">
          {formatFlightPlanCellValue(plan, col)}
        </td>
      ))}
    </>
  );
}
