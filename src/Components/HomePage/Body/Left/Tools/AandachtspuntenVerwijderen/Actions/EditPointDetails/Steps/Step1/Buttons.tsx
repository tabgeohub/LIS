import {
  pickDeletePointFormFields,
  useDeletePointState,
} from "hooks/zustand/tools/useDeletePointState";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useUpdateData } from "utils/useUpdateData";
import Loading from "./Loading";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import {
  buildPointUpdatePayload,
  pickPointCoreLogData,
} from "@helpers/points/buildPointUpdatePayload";

export default function Buttons({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  const logAction = useLogAction();

  const { points, setPoints } = usePointsStore();
  const { mapView, redGraphicsLayer, yellowGraphicsLayer } = useMapViewState();

  const formFields = useDeletePointState(pickDeletePointFormFields);
  const { setMainStep, selectedPoint, clear } = useDeletePointState();

  const { update, loading } = useUpdateData(`/points/${selectedPoint?.id}`);

  function handleSubmit() {
    if (!selectedPoint) return;

    const newPoint = buildPointUpdatePayload(
      formFields,
      selectedPoint.id,
      selectedPoint.created_at
    );

    update(newPoint, (responseData) => {
      if (!responseData.result) return;

      const updatedPoints = points.map((point) =>
        point.id === responseData.result.id
          ? { ...point, ...responseData.result }
          : point
      );

      setPoints(updatedPoints);
      mapView?.graphics.removeAll();
      redGraphicsLayer?.removeAll();
      yellowGraphicsLayer?.removeAll();

      setMainStep("main");
    });

    logAction({
      message: "User clicked 'Save' button",
      step: "Edit point details - Step 1",
      newData: pickPointCoreLogData(selectedPoint),
    });
  }

  const content = useContent();

  return (
    <>
      <div className="flex justify-end gap-x-1 text-[12px] mt-6">
        <button
          onClick={() => {
            clear();
            setMainStep("main");

            logAction({
              message: "User clicked 'Back' button",
              step: "Edit point details - Step 1",
            });
          }}
          className="gray-button"
        >
          {content.common.verwijderen}
        </button>

        <button
          onClick={() => {
            setStep(2);

            logAction({
              message: "User clicked 'Edit geometry' button",
              step: "Edit point details - Step 1",
            });
          }}
          className="gray-button"
        >
          {
            content.tools.aandachtspuntenVerwijderen.editPoint
              .geometrieAanpassen
          }
        </button>

        <button onClick={handleSubmit} className="gray-button">
          {content.common.opslaan}
        </button>

        <button
          className="gray-button"
          type="button"
          onClick={() => {
            setMainStep("main");

            logAction({
              message: "User clicked 'Cancel' button",
              step: "Edit point details - Step 1",
            });
          }}
        >
          {content.common.annuleren}
        </button>
      </div>

      {loading && <Loading />}
    </>
  );
}
