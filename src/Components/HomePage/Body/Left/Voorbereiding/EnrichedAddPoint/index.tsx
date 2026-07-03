/* eslint-disable react-hooks/exhaustive-deps */
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import { useEnrichedPointState } from "../../../../../../hooks/zustand/useEnrichedPointState";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useContent } from "hooks/useContent";
import { useEnrichedAddPointMapClick } from "./useEnrichedAddPointMapClick";

export default function EnrichedAddPoint() {
  const { redGraphicsLayer } = useMapViewState();
  const { setSelectedTab } = useTabState();
  const { points } = usePointsStore();
  const content = useContent();

  const {
    step,
    setLatitude,
    setLongitude,
    setStep,
    setXCoord,
    setYCoord,
    setMapClickedNotify,
    mapClickedNotify,
    setCurrentPoint,
    reset,
  } = useEnrichedPointState();

  useEnrichedAddPointMapClick({
    step,
    points,
    mapClickedNotify,
    nearPointToast: content.voorbereiding.aandachtspuntAanmaken.step1.nearPointToast,
    setMapClickedNotify,
    setXCoord,
    setYCoord,
    setLatitude,
    setLongitude,
    setCurrentPoint,
    setStep,
  });

  function handleCancel() {
    redGraphicsLayer?.removeAll();
    setSelectedTab("none");
    reset();
  }

  return (
    <div className="mt-4 px-2 h-full">
      {step === 1 && <Step1 handleCancel={handleCancel} />}
      {step === 2 && <Step2 handleCancel={handleCancel} />}
      {step === 3 && <Step3 handleCancel={handleCancel} />}
    </div>
  );
}
