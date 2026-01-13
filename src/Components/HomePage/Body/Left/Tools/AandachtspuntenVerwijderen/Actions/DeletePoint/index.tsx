import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { CgSpinner } from "react-icons/cg";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import { usePointsStore } from "hooks/zustand/usePointsStore";
import { useDeleteData } from "utils/useDeleteData";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function DeletePoint() {
  const logAction = useLogAction();

  const { selectedPoint } = useDeletePointState();
  const { setSelectedPoint, setMainStep } = useDeletePointState();

  const { mapView, redGraphicsLayer } = useMapViewState();

  const { points, setPoints } = usePointsStore();
  const { deleteData, loading } = useDeleteData(`/points`);

  function handleSubmit() {
    if (!selectedPoint || !mapView) return;

    deleteData(selectedPoint.id, undefined, () => {
      setPoints(points.filter((p) => p.id !== selectedPoint.id));
      setSelectedPoint(null);
      mapView?.graphics.removeAll();
      redGraphicsLayer?.removeAll();
      setMainStep("main");
    });

    logAction({
      message: "User clicked 'Delete' button",
      step: "Delete point",
      newData: {
        point: selectedPoint.omschrijving,
      },
    });
  }

  const content = useContent();

  return (
    <div className="p-1">
      <div>
        <p className="text-gray-800 leading-3 text-[12px] mt-4">
          {content.tools.aandachtspuntenVerwijderen.deletePoint.title}
        </p>

        <div className="flex justify-end gap-x-1 text-[12px] mt-6">
          <button onClick={handleSubmit} className="gray-button">
            {content.common.verwijderen}
          </button>

          <button
            onClick={() => {
              setMainStep("main");

              logAction({
                message: "User clicked 'Cancel' button",
                step: "Delete point",
              });
            }}
            className="gray-button"
          >
            {content.common.annuleren}
          </button>
        </div>
      </div>

      {loading && (
        <div className="absolute h-full w-full top-0 left-0 bg-gray-100 opacity-50 z-10 flex justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            <CgSpinner className="animate-spin text-blue-500 text-6xl" />
            <p className="text-gray-500 text-sm">
              {" "}
              {content.tools.aandachtspuntenVerwijderen.deletePoint.loading}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
