import { useEffect } from "react";
import { Geometry } from "hooks/features";
import { geometryToDraft, type GeometryEditDraft } from "./helpers/types";
import { cloneGeometryPoints, type GeometryPointRow } from "./helpers/pointTypes";
import type { PointFormState } from "./helpers/pointForm";
import type { EditFormScreen } from "./useEditFormState";

export function useResetEditFormOnGeometryChange(input: {
  geometry: Geometry;
  setDraft: (draft: GeometryEditDraft) => void;
  setPointsDraft: (points: GeometryPointRow[]) => void;
  setScreen: (screen: EditFormScreen) => void;
  setPointForm: (form: PointFormState | null) => void;
  setHoveredVertexId: (id: number | null) => void;
  setSelectedVertexId: (id: number | null) => void;
}) {
  const { geometry } = input;
  useEffect(() => {
    input.setDraft(geometryToDraft(geometry));
    input.setPointsDraft(cloneGeometryPoints(geometry.points));
    input.setScreen("metadata");
    input.setPointForm(null);
    input.setHoveredVertexId(null);
    input.setSelectedVertexId(null);
  }, [geometry.id]);
}

export function useClearVerticesOnMetadata(input: {
  screen: EditFormScreen;
  setHoveredVertexId: (id: number | null) => void;
  setSelectedVertexId: (id: number | null) => void;
}) {
  useEffect(() => {
    if (input.screen === "metadata") {
      input.setHoveredVertexId(null);
      input.setSelectedVertexId(null);
    }
  }, [input.screen, input.setHoveredVertexId, input.setSelectedVertexId]);
}
