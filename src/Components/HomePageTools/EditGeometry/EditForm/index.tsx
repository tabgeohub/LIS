import { useEditFormController } from "./useEditFormController";
import { EditFormView } from "./EditFormView";
import type { EditFormProps } from "./editFormTypes";

export type { GeometryEditDraft } from "./helpers/types";
export type { GeometryPointRow } from "./helpers/pointTypes";

export default function EditForm({
  geometry,
  onCancel,
  onSave,
  onPointUpdated,
  isSavingMetadata = false,
}: EditFormProps) {
  const ctrl = useEditFormController(geometry, onPointUpdated);
  return (
    <EditFormView
      geometry={geometry}
      onCancel={onCancel}
      onSave={onSave}
      isSavingMetadata={isSavingMetadata}
      ctrl={ctrl}
    />
  );
}
