import Options from "./Options";
import Text from "./Text";
import { useDrawingToolStep1Model } from "./useDrawingToolStep1Model";
import { DrawingToolStep1Actions } from "./DrawingToolStep1Actions";
import { DrawingToolStep1Header } from "./DrawingToolStep1Header";

export default function Step1() {
  const model = useDrawingToolStep1Model();
  return (
    <div className="p-4">
      <DrawingToolStep1Header />
      <Options
        selectedTool={model.selectedTool}
        setSelectedTool={model.setSelectedTool}
        graphicsLayer={model.graphicsLayer}
        setGraphicsLayer={model.setGraphicsLayer}
        sketchViewModel={model.sketchViewModel}
        setSketchViewModel={model.setSketchViewModel}
        mapView={model.mapView}
        handleClear={model.handleClear}
      />
      <Text selectedTool={model.selectedTool} />
      <DrawingToolStep1Actions model={model} />
    </div>
  );
}
