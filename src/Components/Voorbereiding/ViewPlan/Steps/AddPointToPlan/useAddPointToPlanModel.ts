import { useUpdateData } from "api-hooks/mutations";
import { useRenderLocalGeometries } from "Components/HomePage/hooks/features/useRenderLocalGeometries";
import {
  useAddPointToPlanBluePoints,
  useAddPointToPlanPins,
} from "./useAddPointToPlanMapEffects";
import { useAddPointToPlanSelections } from "./useAddPointToPlanSelections";

export function useAddPointToPlanModel() {
  const selections = useAddPointToPlanSelections();
  const { update, loading } = useUpdateData(`/flightPlans/vluchtplans/points`);

  useAddPointToPlanBluePoints(selections.filteredPoints);
  useRenderLocalGeometries(selections.filteredGeometries);
  useAddPointToPlanPins(selections.selectedPointIds, selections.dbPoints);

  return { ...selections, update, loading };
}
