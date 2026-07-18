import type { Geometry } from "hooks/features/useGeometriesStore";
import {
  mergeSavedGeometry,
  replaceGeometryInList,
} from "./mergeSavedGeometry";

export function applyGeometrySaveSuccess(input: {
  editingGeometry: Geometry;
  payload: Record<string, unknown> & { points?: Geometry["points"] };
  responseData: { result?: Partial<Geometry> & { points?: Geometry["points"] } };
  dbGeometries: Geometry[];
  setGeometries: (g: Geometry[]) => void;
  setDbGeometries: (g: Geometry[]) => void;
  removeEditGeometryHighlight: () => void;
  setEditingGeometry: (g: Geometry | null) => void;
  logAction: (entry: {
    message: string;
    step: string;
    newData: Record<string, unknown>;
  }) => void;
}) {
  const updated = mergeSavedGeometry({
    editingGeometry: input.editingGeometry,
    payload: input.payload,
    result: input.responseData?.result,
  });
  const list = replaceGeometryInList(input.dbGeometries, updated);
  input.setGeometries(list);
  input.setDbGeometries(list);
  input.logAction({
    message: "User saved geometry form",
    step: "Edit Geometry",
    newData: {
      geometryId: updated.id,
      omschrijving: updated.omschrijving,
      organisatie: updated.organisatie,
      pointsCount: updated.points?.length,
    },
  });
  input.removeEditGeometryHighlight();
  input.setEditingGeometry(null);
}
