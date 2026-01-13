import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import { usePointsStore } from "hooks/zustand/usePointsStore";
import { useUpdateData } from "utils/useUpdateData";
import Loading from "./Loading";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function Buttons({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  const logAction = useLogAction();

  const { points, setPoints } = usePointsStore();
  const { mapView, redGraphicsLayer, yellowGraphicsLayer } = useMapViewState();

  const {
    setMainStep,
    omschrijving,
    regio_id,
    herhalen,
    vertrouwelijk,
    user_id,
    activiteit_id,
    organisatie_id,
    specifiek_letten_op,
    selectedPoint,
    xcoordinaat_rd,
    ycoordinaat_rd,
    latitude,
    longitude,

    clear,
  } = useDeletePointState();

  const { update, loading } = useUpdateData(`/points/${selectedPoint?.id}`);

  function handleSubmit() {
    if (!selectedPoint) return;

    const newPoint = {
      omschrijving,
      regio_id,
      xcoordinaat_rd,
      ycoordinaat_rd,
      latitude,
      longitude,
      vertrouwelijk,
      herhalen: herhalen ? 1 : 0,
      user_id,
      activiteit_id,
      organisatie_id,
      specifiek_letten_op,
      datum: selectedPoint?.created_at,
      id: selectedPoint?.id,
    };

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
      newData: {
        omschrijving: selectedPoint.omschrijving,
        regio_id: selectedPoint.regio_id,
        xcoordinaat_rd: selectedPoint.xcoordinaat_rd,
        ycoordinaat_rd: selectedPoint.ycoordinaat_rd,
        latitude: selectedPoint.latitude,
        longitude: selectedPoint.longitude,
        vertrouwelijk: selectedPoint.vertrouwelijk,
        herhalen: selectedPoint.herhalen,
        user_id: selectedPoint.user_id,
        activiteit_id: selectedPoint.activiteit_id,
        organisatie_id: selectedPoint.organisatie_id,
        specifiek_letten_op: selectedPoint.specifiek_letten_op,
      },
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
