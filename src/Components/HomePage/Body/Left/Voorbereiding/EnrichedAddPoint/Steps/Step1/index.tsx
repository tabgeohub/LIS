import { useState } from "react";
import { CiWarning } from "react-icons/ci";

import SearchWidget from "../../Common/SearchWidget";
import { useEnrichedPointState } from "../../../../../../../../hooks/zustand/useEnrichedPointState";
import CancelModal from "Components/HomePage/Body/Common/CancelModal";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function Step1({ handleCancel }: { handleCancel: () => void }) {
  const { setStep } = useEnrichedPointState();

  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [showText, setShowText] = useState(false);

  const logAction = useLogAction();

  const content = useContent();

  return (
    <div>
      <p className="text-gray-800 leading-3 text-[12px] h-full">
        {content.voorbereiding.aandachtspuntAanmaken.step1.text}
      </p>

      <div className="bg-gray-100 group cursor-pointer hover:bg-primary border transition-all duration-300 w-[35px] aspect-square border-gray-200 rounded-lg flex items-center justify-center mt-4">
        <div className="bg-primary group-hover:bg-gray-100 border w-2 h-2 rounded-full transition-all duration-300" />
      </div>

      <div className="flex relative justify-between gap-x-1 text-[12px] mt-2">
        <SearchWidget />

        <div className="flex gap-x-1 text-[12px]">
          <button
            onClick={() => {
              setStep(2);
              logAction({
                message: "User clicked 'Invoeren' button",
                step: "First step",
              });
            }}
            className="gray-button"
          >
            {content.common.invoeren}
          </button>

          <button
            onClick={() => {
              setShowText(true);

              logAction({
                message: "User clicked 'Volgende' button",
                step: "First step",
              });
            }}
            className="gray-button"
          >
            {content.common.volgende}
          </button>

          <button
            onClick={() => {
              handleCancel();
              logAction({
                message: "User clicked 'Annuleren' button",
                step: "First step",
              });
            }}
            className="gray-button"
          >
            {content.common.annuleren}
          </button>
        </div>
      </div>

      {showText && (
        <div className="flex items-center gap-x-2 my-4">
          <CiWarning className="size-6" />

          <p className="text-[12px]">
            {content.voorbereiding.aandachtspuntAanmaken.step1.warning}
          </p>
        </div>
      )}

      <CancelModal
        handleCancel={() => setOpenCancelModal(false)}
        handleSubmit={handleCancel}
        isOpen={openCancelModal}
        setIsOpen={setOpenCancelModal}
      />
    </div>
  );
}
