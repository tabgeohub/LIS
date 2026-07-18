import { Geometry } from "hooks/features/useGeometriesStore";
import type { GeometryEditDraft } from "./helpers/types";
import type { GeometryPointRow } from "./helpers/pointTypes";
import { useEditFormController } from "./useEditFormController";

export type EditFormProps = {
  geometry: Geometry;
  onCancel: () => void;
  onSave?: (draft: GeometryEditDraft, points?: GeometryPointRow[]) => void;
  onPointUpdated?: (
    updatedPoint: GeometryPointRow,
    allPoints: GeometryPointRow[]
  ) => void;
  isSavingMetadata?: boolean;
};

export type EditFormController = ReturnType<typeof useEditFormController>;
