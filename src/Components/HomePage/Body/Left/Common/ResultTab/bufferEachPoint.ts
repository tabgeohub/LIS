import { addPointBufferGraphic } from "./addPointBufferGraphic";
import type { RunPointListBufferInput } from "./runPointListBufferTypes";

export function bufferEachPoint(input: RunPointListBufferInput) {
  input.pointsTable.forEach((point) => {
    addPointBufferGraphic({
      graphicsLayer: input.graphicsLayer!,
      point,
      distance: input.distance,
      unit: input.unit,
      spatialReference: input.spatialReference,
    });
    input.setFase("listPoints");
  });
}
