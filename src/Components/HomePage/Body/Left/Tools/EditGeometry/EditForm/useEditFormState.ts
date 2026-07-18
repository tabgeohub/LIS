import { useState } from "react";
import { Geometry } from "hooks/features/useGeometriesStore";
import { geometryToDraft } from "./helpers/types";
import { cloneGeometryPoints } from "./helpers/pointTypes";
import type { PointFormState } from "./helpers/pointForm";
import type { GeometryEditDraft } from "./helpers/types";
import type { GeometryPointRow } from "./helpers/pointTypes";
import useEditGeometryVerticesOnMap from "hooks/hover-click-handlers/useEditGeometryVerticesOnMap";
import {
  useClearVerticesOnMetadata,
  useResetEditFormOnGeometryChange,
} from "./useEditFormEffects";

export type EditFormScreen = "metadata" | "pointsList" | "pointEdit";

function useEditFormDraftState(geometry: Geometry) {
  const [draft, setDraft] = useState<GeometryEditDraft>(() =>
    geometryToDraft(geometry)
  );
  const [screen, setScreen] = useState<EditFormScreen>("metadata");
  const [pointsDraft, setPointsDraft] = useState<GeometryPointRow[]>(() =>
    cloneGeometryPoints(geometry.points)
  );
  const [pointForm, setPointForm] = useState<PointFormState | null>(null);
  const [hoveredVertexId, setHoveredVertexId] = useState<number | null>(null);
  const [selectedVertexId, setSelectedVertexId] = useState<number | null>(null);
  return {
    draft,
    setDraft,
    screen,
    setScreen,
    pointsDraft,
    setPointsDraft,
    pointForm,
    setPointForm,
    hoveredVertexId,
    setHoveredVertexId,
    selectedVertexId,
    setSelectedVertexId,
  };
}

export function useEditFormState(geometry: Geometry) {
  const state = useEditFormDraftState(geometry);
  useEditGeometryVerticesOnMap({
    showVertices: state.screen === "pointsList" || state.screen === "pointEdit",
    points: state.pointsDraft,
    hoveredPointId: state.hoveredVertexId,
    selectedPointId: state.selectedVertexId,
  });
  useResetEditFormOnGeometryChange({
    geometry,
    setDraft: state.setDraft,
    setPointsDraft: state.setPointsDraft,
    setScreen: state.setScreen,
    setPointForm: state.setPointForm,
    setHoveredVertexId: state.setHoveredVertexId,
    setSelectedVertexId: state.setSelectedVertexId,
  });
  useClearVerticesOnMetadata(
    state.screen,
    state.setHoveredVertexId,
    state.setSelectedVertexId
  );
  return state;
}
