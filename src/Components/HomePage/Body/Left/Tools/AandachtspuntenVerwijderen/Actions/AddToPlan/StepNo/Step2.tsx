import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import { FlightPlanType } from "Types";

export default function Step2({
  selectedPlan,
}: {
  selectedPlan: FlightPlanType;
}) {
  const logAction = useLogAction();

  const { mapView, redGraphicsLayer, yellowGraphicsLayer } = useMapViewState();
  const { setSelectedPoint, setSelectedPoints, setMainStep } =
    useDeletePointState();

  function handleCancel() {
    setSelectedPoint(null);
    setSelectedPoints([]);
    setMainStep("main");

    mapView?.graphics.removeAll();
    redGraphicsLayer?.removeAll();
    yellowGraphicsLayer?.removeAll();

    logAction({
      message: "User clicked 'Cancel' button",
      step: "Add to plan - Step no",
    });
  }

  const content = useContent();

  return (
    <>
      <div className="text-[12px] mt-2">
        {content.tools.aandachtspuntenVerwijderen.addToPlan.step2Text} '
        {selectedPlan?.omschrijving}'.
      </div>

      <div className="flex justify-end">
        <button onClick={handleCancel} className="gray-button">
          {content.common.annuleren}
        </button>
      </div>
    </>
  );
}
