import type { Dispatch, SetStateAction } from "react";
import {
  formToPointRow,
  pointToForm,
  type PointFormState,
} from "./helpers/pointForm";
import type { GeometryPointRow } from "./helpers/pointTypes";
import type { EditFormScreen } from "./useEditFormState";

type NavInput = {
  pointsDraft: GeometryPointRow[];
  setScreen: (screen: EditFormScreen) => void;
  setPointForm: (form: PointFormState | null) => void;
  setHoveredVertexId: (id: number | null) => void;
  setSelectedVertexId: (id: number | null) => void;
};

type PointDraftUpdateHandlers = {
  setPointsDraft: Dispatch<SetStateAction<GeometryPointRow[]>>;
  setPointForm: (form: PointFormState | null) => void;
  onPointUpdated?: (
    updatedPoint: GeometryPointRow,
    allPoints: GeometryPointRow[]
  ) => void;
};

export function createEditFormNavigation(input: NavInput) {
  const clear = () => {
    input.setPointForm(null);
    input.setHoveredVertexId(null);
    input.setSelectedVertexId(null);
  };
  return {
    openPointsEditor: () => input.setScreen("pointsList"),
    backToMetadata: () => {
      input.setScreen("metadata");
      clear();
    },
    openPointEdit: (pointId: number) => {
      const p = input.pointsDraft.find((x) => x.id === pointId);
      if (!p) return;
      input.setHoveredVertexId(null);
      input.setSelectedVertexId(pointId);
      input.setPointForm(pointToForm(p));
      input.setScreen("pointEdit");
    },
    backToPointsList: () => {
      input.setScreen("pointsList");
      clear();
    },
  };
}

export function applyPointUpdateSuccess(
  input: PointDraftUpdateHandlers & {
    updated: GeometryPointRow;
    responseData: { result?: GeometryPointRow };
  }
) {
  if (!input.responseData?.result) return;
  const nextUpdatedPoint = {
    ...input.updated,
    ...input.responseData.result,
  } as GeometryPointRow;
  input.setPointsDraft((prev) => {
    const nextPoints = prev.map((p) =>
      p.id === nextUpdatedPoint.id ? nextUpdatedPoint : p
    );
    input.onPointUpdated?.(nextUpdatedPoint, nextPoints);
    return nextPoints;
  });
  input.setPointForm(pointToForm(nextUpdatedPoint));
}

export function submitEditFormPoint(
  input: PointDraftUpdateHandlers & {
    e: React.FormEvent;
    pointForm: PointFormState | null;
    pointsDraft: GeometryPointRow[];
    updatePoint: (args: {
      data: GeometryPointRow;
      onSuccess: (responseData: { result?: GeometryPointRow }) => void;
    }) => void;
  }
) {
  input.e.preventDefault();
  if (input.pointForm == null) return;
  const base = input.pointsDraft.find((p) => p.id === input.pointForm!.id);
  if (!base) return;
  const updated = formToPointRow(base, input.pointForm);
  input.updatePoint({
    data: updated,
    onSuccess: (responseData) =>
      applyPointUpdateSuccess({ ...input, updated, responseData }),
  });
}
