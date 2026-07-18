import { bufferEachPoint } from "./bufferEachPoint";
import type { RunPointListBufferInput } from "./runPointListBufferTypes";

export function runPointListBuffer(input: RunPointListBufferInput) {
  if (!input.graphicsLayer) return;
  input.graphicsLayer.removeAll();
  bufferEachPoint(input);
  input.logAction({
    message: `User clicked 'Doorgaan' to buffer points`,
    step: "ResultTab - PointListBuffer",
  });
}
