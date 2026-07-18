export type {
  BuildFlightPlanSelectColumnsInput,
  FlightPlanColumnPreset,
} from "./flightPlanColumnTypes";
import type { BuildFlightPlanSelectColumnsInput } from "./flightPlanColumnTypes";
import { resolveFlightPlanColumnPreset } from "./resolveFlightPlanColumnPreset";

export function buildFlightPlanSelectColumns(
  input: BuildFlightPlanSelectColumnsInput
): string {
  const columns = resolveFlightPlanColumnPreset(input.preset, input.planAlias);
  if (!input.extraSelect) {
    return columns;
  }
  return `${columns}
        ${input.extraSelect},`;
}
