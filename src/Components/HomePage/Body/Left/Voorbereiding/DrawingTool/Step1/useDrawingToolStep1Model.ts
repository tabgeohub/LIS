import { useTabState } from "hooks/zustand/ui/tabState";
import { useContent } from "hooks/useContent";
import { cleanupDrawingToolMap } from "../helpers/drawingToolMapCleanup";
import { resetSketchSession } from "../helpers/resetSketchSession";
import { useDrawingToolSketchState } from "./useDrawingToolSketchState";

export function useDrawingToolStep1Model() {
  const { setSelectedTab } = useTabState();
  const sketch = useDrawingToolSketchState();
  const handleClear = () => {
    cleanupDrawingToolMap(sketch.mapView);
    resetSketchSession({
      sketchViewModel: sketch.sketchViewModel,
      mapView: sketch.mapView,
      setSketchViewModel: sketch.setSketchViewModel,
      setSelectedTool: sketch.setSelectedTool,
    });
  };
  return {
    ...sketch,
    content: useContent(),
    handleClear,
    handleCancel: () => {
      handleClear();
      setSelectedTab("none");
    },
  };
}
