import Form from "./Form";
import Buttons from "./Buttons";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useDrawingStore } from "hooks/zustand/useDrawingStore";
import { useDrawingToolStep2Lifecycle } from "../helpers/useDrawingToolLifecycle";

export default function Step2() {
  const { mapView } = useMapViewState();
  const { selectedTab } = useTabState();
  const { step, clear } = useDrawingStore();

  useDrawingToolStep2Lifecycle(mapView, selectedTab, step, clear);

  return (
    <div className="max-h-[97%] p-2 overflow-y-auto thin-scrollbar">
      <Form />

      <Buttons />
    </div>
  );
}
