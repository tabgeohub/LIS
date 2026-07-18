import { Geometry } from "hooks/features/useGeometriesStore";
import { useUpdateData } from "utils/useUpdateData";
import type { GeometryPointRow } from "./helpers/pointTypes";
import { useEditFormState } from "./useEditFormState";
import {
  createEditFormNavigation,
  submitEditFormPoint,
} from "./editFormActions";

export function useEditFormController(
  geometry: Geometry,
  onPointUpdated?: (
    updatedPoint: GeometryPointRow,
    allPoints: GeometryPointRow[]
  ) => void
) {
  const state = useEditFormState(geometry);
  const { update: updatePoint, loading: isUpdatingPoint } = useUpdateData(
    `/points/${state.pointForm?.id ?? 0}`
  );
  const nav = createEditFormNavigation(state);

  return {
    draft: state.draft,
    setDraft: state.setDraft,
    screen: state.screen,
    pointsDraft: state.pointsDraft,
    pointForm: state.pointForm,
    setPointForm: state.setPointForm,
    setHoveredVertexId: state.setHoveredVertexId,
    isUpdatingPoint,
    ...nav,
    submitPoint: (e: React.FormEvent) =>
      submitEditFormPoint({
        e,
        pointForm: state.pointForm,
        pointsDraft: state.pointsDraft,
        updatePoint,
        setPointsDraft: state.setPointsDraft,
        setPointForm: state.setPointForm,
        onPointUpdated,
      }),
  };
}
