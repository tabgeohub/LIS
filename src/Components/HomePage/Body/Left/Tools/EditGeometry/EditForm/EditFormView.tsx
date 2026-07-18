import type { EditFormController, EditFormProps } from "./editFormTypes";
import { renderEditFormScreen } from "./renderEditFormScreen";

export function EditFormView(
  props: EditFormProps & { ctrl: EditFormController }
) {
  return (
    <div className="flex flex-col h-[90%]">{renderEditFormScreen(props)}</div>
  );
}
