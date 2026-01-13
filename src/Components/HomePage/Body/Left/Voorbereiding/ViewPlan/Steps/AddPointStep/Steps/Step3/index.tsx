import { useState } from "react";
import Buttons from "./Buttons";
import Form from "./Form";
import CancelModal from "Components/HomePage/Body/Common/CancelModal";
import { useViewPlanState } from "../../../../helpers/useViewPlanState";

export default function Step3({
  handleCancel,
  resetFormAndState,
  setStepAdd,
}: {
  handleCancel: () => void;
  resetFormAndState: () => void;
  setStepAdd: (value: number) => void;
}) {
  const [openCancelModal, setOpenCancelModal] = useState(false);

  const { setStep } = useViewPlanState();

  return (
    <div className="max-h-[97%] pb-2 overflow-y-auto thin-scrollbar">
      <Form />

      <Buttons
        handleCancel={handleCancel}
        resetFormAndState={resetFormAndState}
        setStepPoint={setStep}
        setStepAdd={setStepAdd}
      />

      <CancelModal
        handleCancel={() => setOpenCancelModal(false)}
        handleSubmit={handleCancel}
        isOpen={openCancelModal}
        setIsOpen={setOpenCancelModal}
      />
    </div>
  );
}
