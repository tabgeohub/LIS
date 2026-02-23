import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import useLogAction from "hooks/useLogAction";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useFetchInitialFeatures } from "hooks/features/useFetchInitialFeatures";
import { CgClose, CgSpinner } from "react-icons/cg";
import { useContent } from "hooks/useContent";
import { useUpdateData } from "utils/useUpdateData";
import { useAuth } from "@helpers/ZustandStates/useAuth";

export default function DeletePoint() {
  const logAction = useLogAction();
  const content = useContent();

  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();

  const { user } = useAuth();

  const { clickedPointId } = usePopUpState();
  const { points } = usePointsStore();
  const { fetchInitialFeatures } = useFetchInitialFeatures();

  const { mapView } = useMapViewState();

  // const { deleteData, loading } = useDeleteData(`/points`);

  const { update, loading } = useUpdateData(`/points/${clickedPointId}/status`);

  function handleSubmit() {
    if (!mapView) return;

    update({ id: clickedPointId, status: "inactief" }, () => {
      fetchInitialFeatures(user?.role);

      setSelectedBottomTab("viewSelectedPointDetails");
    });

    logAction({
      message: "User clicked 'Delete' button to delete a point",
      step: "Delete point",
      newData: {
        point: points.find((p) => p.id !== clickedPointId),
      },
    });
  }

  return (
    <div className="mt-2 p-1">
      <div className="flex justify-between items-center p-1">
        <p></p>

        <p className="text-gray-400">
          {content.voorbereiding.selectedPoint.deletePoint.title}
        </p>

        <button
          onClick={() => {
            setSelectedTab("none");
            setSelectedBottomTab("Kaartlagenlijst");

            logAction({
              message: "User clicked close icon ",
              step: "Delete point",
            });
          }}
        >
          <CgClose className="text-gray-400" />
        </button>
      </div>

      <div className="w-full h-[1px] bg-gray-200" />

      <div>
        <p className="text-gray-800 leading-3 text-[12px] mt-4">
          {content.voorbereiding.selectedPoint.deletePoint.confirm}
        </p>

        <div className="flex justify-end gap-x-1 text-[12px] mt-6">
          <button onClick={handleSubmit} className="gray-button">
            {content.voorbereiding.selectedPoint.deletePoint.delete}
          </button>

          <button
            onClick={() => {
              setSelectedTab("none");
              setSelectedBottomTab("Kaartlagenlijst");

              logAction({
                message: "User clicked 'Cancel' button",
                step: "Delete point",
              });
            }}
            className="gray-button"
          >
            {content.voorbereiding.selectedPoint.deletePoint.cancel}
          </button>
        </div>
      </div>

      {loading && (
        <div className="absolute h-full w-full top-0 left-0 bg-gray-100 opacity-50 z-10 flex justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            <CgSpinner className="animate-spin text-blue-500 text-6xl" />
            <p className="text-gray-500 text-sm">
              {content.voorbereiding.selectedPoint.deletePoint.loading}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
