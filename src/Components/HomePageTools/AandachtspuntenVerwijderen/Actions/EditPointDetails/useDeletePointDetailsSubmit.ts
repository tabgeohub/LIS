import {
  pickDeletePointFormFields,
  useDeletePointState,
} from "Components/HomePageTools/AandachtspuntenVerwijderen/state/useDeletePointState";
import { usePointsStore } from "hooks/features";
import { useUpdateData } from "api-hooks/mutations";
import { useMapViewState } from "hooks/zustand/ui";
import { submitDeletePointDetailsUpdate } from "./submitDeletePointDetailsUpdate";

/** Shared Step1/Step2 submit wiring for delete-point edit details. */
export function useDeletePointDetailsSubmit(
  onApplied: () => void,
  options?: { includeYellowGraphicsLayer?: boolean }
) {
  const { points, setPoints } = usePointsStore();
  const { mapView, redGraphicsLayer, yellowGraphicsLayer } = useMapViewState();
  const formFields = useDeletePointState(pickDeletePointFormFields);
  const { selectedPoint } = useDeletePointState();
  const { update, loading } = useUpdateData(`/points/${selectedPoint?.id}`);

  function handleSubmit() {
    submitDeletePointDetailsUpdate({
      selectedPoint,
      formFields,
      update,
      points,
      setPoints,
      mapView,
      redGraphicsLayer,
      yellowGraphicsLayer: options?.includeYellowGraphicsLayer
        ? yellowGraphicsLayer
        : undefined,
      onApplied,
    });
  }

  return { handleSubmit, loading, selectedPoint };
}
