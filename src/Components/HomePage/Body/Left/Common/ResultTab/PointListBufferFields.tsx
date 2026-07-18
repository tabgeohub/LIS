import {
  PointListBufferDistanceField,
  PointListBufferUnitField,
} from "./PointListBufferFieldInputs";
import type { PointListBufferFormInput } from "./PointListBufferFormTypes";

export function PointListBufferFields(
  input: Omit<PointListBufferFormInput, "onClear" | "onCancel" | "onBuffer">
) {
  return (
    <>
      <PointListBufferDistanceField
        distance={input.distance}
        setDistance={input.setDistance}
      />
      <PointListBufferUnitField unit={input.unit} setUnit={input.setUnit} />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={input.saveToSketch}
          onChange={(e) => input.setSaveToSketch(e.target.checked)}
        />
        <label className="text-sm text-gray-700">Opslaan in schetslaag</label>
      </div>
    </>
  );
}
