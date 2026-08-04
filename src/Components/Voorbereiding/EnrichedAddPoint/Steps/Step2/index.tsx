/* eslint-disable react-hooks/exhaustive-deps */
import { useMapViewState } from "hooks/zustand/ui";

import { useState } from "react";
import { useEnrichedPointState } from "Components/Voorbereiding/EnrichedAddPoint/state/useEnrichedPointState";
import CancelModal from "Components/Common/CancelModal";
import UpdateBtn from "./UpdateBtn";
import NextBtn from "./NextBtn";
import useCoordinatesWatcher from "./useCoordinatesWatcher";
import CoordinatesInput from "./CoordinatesInput";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function Step2({ handleCancel }: { handleCancel: () => void }) {
  const { redGraphicsLayer } = useMapViewState();
  useCoordinatesWatcher();

  const [openCancelModal, setOpenCancelModal] = useState(false);

  const { setStep } = useEnrichedPointState();

  const logAction = useLogAction();

  const content = useContent();

  return (
    <div className="text-gray-800 leading-3 text-[13px]">
      <p>{content.voorbereiding.aandachtspuntAanmaken.step3.text}</p>

      <CoordinatesInput />

      <div className="flex justify-end gap-x-1 text-[12px] mt-6">
        <button
          onClick={() => {
            setStep(1);
            redGraphicsLayer?.removeAll();

            logAction({
              message: "User clicked 'Previous' button",
              step: "Second step",
            });
          }}
          className="gray-button"
        >
          {content.common.vorige}
        </button>

        <UpdateBtn />

        <NextBtn />

        <button
          onClick={() => {
            handleCancel();

            logAction({
              message: "User clicked 'Cancel' button",
              step: "Second step",
            });
          }}
          className="gray-button"
        >
          {content.common.annuleren}
        </button>
      </div>

      <CancelModal
        handleCancel={() => setOpenCancelModal(false)}
        handleSubmit={handleCancel}
        isOpen={openCancelModal}
        setIsOpen={setOpenCancelModal}
      />
    </div>
  );
}
