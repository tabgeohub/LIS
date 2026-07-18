import { PointListBufferActions } from "./PointListBufferActions";
import { PointListBufferFields } from "./PointListBufferFields";
import type { PointListBufferFormInput } from "./PointListBufferFormTypes";

export function PointListBufferForm(input: PointListBufferFormInput) {
  return (
    <div className="p-4 bg-white shadow rounded w-full  space-y-4">
      <PointListBufferFields {...input} />
      <PointListBufferActions
        onClear={input.onClear}
        onCancel={input.onCancel}
        onBuffer={input.onBuffer}
      />
    </div>
  );
}
