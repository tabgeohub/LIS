import { useFormikContext } from "formik";
import { useTabState } from "hooks/zustand/ui";
import { useSelectedBottomTabState } from "hooks/zustand/ui";
import { usePopUpState } from "hooks/zustand/ui";
import { CgSpinner } from "react-icons/cg";
import { EnrichedPointType } from "Types";
import { useUpdateData } from "api-hooks/mutations";
import { useFetchInitialFeatures } from "hooks/features/useFetchInitialFeatures";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import useLogAction from "hooks/useLogAction";
import { useAuth } from "hooks/zustand/ui";
import {
  buildPointUpdatePayload,
  pickPointCoreLogData,
} from "helpers/points/buildPointUpdatePayload";

export default function Buttons({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  const logAction = useLogAction();
  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { clickedPoint } = usePopUpState();
  const { update, loading } = useUpdateData(`/points/${clickedPoint?.id}`);
  const { fetchInitialFeatures } = useFetchInitialFeatures();
  const { resetFeatures } = useResetFeatures();
  const { values } = useFormikContext();
  const { user } = useAuth();

  function handleClose() {
    setSelectedBottomTab("Kaartlagenlijst");
    setSelectedTab("none");

    logAction({
      message: "User clicked 'Cancel' button",
      step: "Edit point details - Step 1",
    });
  }

  function handleSubmit(point: EnrichedPointType) {
    const attributes = buildPointUpdatePayload({
      fields: point,
      id: point.id,
      created_at: point.created_at,
    });

    update({
      data: attributes,
      onSuccess: (responseData) => {
        if (!responseData.result) return;

        fetchInitialFeatures(user?.role);

        resetFeatures();
        setSelectedBottomTab("viewSelectedPointDetails");
      },
    });

    logAction({
      message: "User clicked 'Save' button to edit a point",
      step: "Edit point details - Step 2",
      newData: pickPointCoreLogData(point),
    });
  }

  return (
    <>
      <div className="flex justify-end gap-x-1 text-[12px] mt-6">
        <button className="gray-button">Verwijderen</button>

        <button
          onClick={() => {
            setStep(2);

            logAction({
              message: "User clicked 'Geometry change' button",
              step: "Edit point details - Step 1",
            });
          }}
          className="gray-button"
        >
          Geometrie aanpassen
        </button>

        <button
          onClick={() => {
            handleSubmit(values as EnrichedPointType);

            logAction({
              message: "User clicked 'Save' button",
              step: "Edit point details - Step 1",
            });
          }}
          className="gray-button"
        >
          Opslaan
        </button>

        <button className="gray-button" type="button" onClick={handleClose}>
          Annuleren
        </button>
      </div>

      {loading && (
        <div className="absolute h-full w-full top-0 left-0 bg-gray-100 opacity-50 z-10 flex justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            <CgSpinner className="animate-spin text-blue-500 text-6xl" />
            <p className="text-gray-500 text-sm">Bezig met opslaan...</p>
          </div>
        </div>
      )}
    </>
  );
}
