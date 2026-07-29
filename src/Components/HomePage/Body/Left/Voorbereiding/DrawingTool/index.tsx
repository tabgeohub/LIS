import Step1 from "./Step1";
import Step2 from "./Step2";
import { useDrawingStore } from "hooks/zustand/useDrawingStore";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useTabState } from "hooks/zustand/ui/tabState";
import { useDrawingToolRootLifecycle } from "./helpers/useDrawingToolLifecycle";

export default function DrawingTool() {
  const { step, setStep, clear } = useDrawingStore();
  const { mapView } = useMapViewState();
  const { selectedTab } = useTabState();

  useDrawingToolRootLifecycle({
    mapView,
    selectedTab,
    clear,
    setStep,
  });

  return (
    <div>
      {step === 1 && <Step1 />}

      {step === 2 && <Step2 />}
    </div>
  );
}
