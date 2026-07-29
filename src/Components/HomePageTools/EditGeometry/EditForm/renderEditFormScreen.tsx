import type { EditFormController, EditFormProps } from "./editFormTypes";
import { EditFormMetadataScreen } from "./EditFormScreens";
import { EditFormPointsListScreen } from "./EditFormScreens";
import { EditFormPointEditScreen } from "./EditFormScreens";

export function renderEditFormScreen(
  props: EditFormProps & { ctrl: EditFormController }
) {
  const { geometry, onCancel, onSave, isSavingMetadata = false, ctrl } = props;
  if (ctrl.screen === "metadata") {
    return (
      <EditFormMetadataScreen
        geometry={geometry}
        draft={ctrl.draft}
        setDraft={ctrl.setDraft}
        onCancel={onCancel}
        onSave={onSave}
        pointsDraft={ctrl.pointsDraft}
        openPointsEditor={ctrl.openPointsEditor}
        isSavingMetadata={isSavingMetadata}
      />
    );
  }
  if (ctrl.screen === "pointsList") {
    return (
      <EditFormPointsListScreen
        pointsDraft={ctrl.pointsDraft}
        openPointEdit={ctrl.openPointEdit}
        setHoveredVertexId={ctrl.setHoveredVertexId}
        backToMetadata={ctrl.backToMetadata}
      />
    );
  }
  if (ctrl.screen === "pointEdit" && ctrl.pointForm) {
    return (
      <EditFormPointEditScreen
        pointForm={ctrl.pointForm}
        setPointForm={ctrl.setPointForm}
        submitPoint={ctrl.submitPoint}
        backToPointsList={ctrl.backToPointsList}
        isUpdatingPoint={ctrl.isUpdatingPoint}
      />
    );
  }
  return null;
}
