import { useMapViewState } from "hooks/zustand/ui";
import { usePopUpState } from "hooks/zustand/ui";
import { useSelectedBottomTabState } from "hooks/zustand/ui";
import { useTabState } from "hooks/zustand/ui";
import useLogAction from "hooks/useLogAction";
import { usePointsStore } from "hooks/features";
import { useFetchInitialFeatures } from "hooks/features/useFetchInitialFeatures";
import { CgClose } from "react-icons/cg";
import { useContent } from "hooks/useContent";
import { useUpdateData } from "api-hooks/mutations";
import { useAuth } from "hooks/zustand/ui";
import WizardLoadingOverlay from "Components/Common/Wizard/WizardLoadingOverlay";

export default function DeletePoint() {
  const logAction = useLogAction();
  const content = useContent();
  const labels = content.voorbereiding.selectedPoint.deletePoint;

  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { user } = useAuth();
  const { clickedPointId } = usePopUpState();
  const { points } = usePointsStore();
  const { fetchInitialFeatures } = useFetchInitialFeatures();
  const { mapView } = useMapViewState();
  const { update, loading } = useUpdateData(`/points/${clickedPointId}/status`);

  function closePanel() {
    setSelectedTab("none");
    setSelectedBottomTab("Kaartlagenlijst");
  }

  function handleSubmit() {
    if (!mapView) return;

    update({
      data: { id: clickedPointId, status: "inactief" },
      onSuccess: () => {
        fetchInitialFeatures(user?.role);
        setSelectedBottomTab("viewSelectedPointDetails");
      },
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
    <div className="relative mt-2 p-1">
      <div className="flex justify-between items-center p-1">
        <p />
        <p className="text-gray-400">{labels.title}</p>
        <button
          type="button"
          onClick={() => {
            closePanel();
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
          {labels.confirm}
        </p>

        <div className="flex justify-end gap-x-1 text-[12px] mt-6">
          <button type="button" onClick={handleSubmit} className="gray-button">
            {labels.delete}
          </button>

          <button
            type="button"
            onClick={() => {
              closePanel();
              logAction({
                message: "User clicked 'Cancel' button",
                step: "Delete point",
              });
            }}
            className="gray-button"
          >
            {labels.cancel}
          </button>
        </div>
      </div>

      <WizardLoadingOverlay show={loading} message={labels.loading} />
    </div>
  );
}
