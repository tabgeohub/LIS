import { useState } from "react";
import Buttons from "./Buttons";
import Form from "./Form";
import CancelModal from "Components/HomePage/Body/Common/CancelModal";

export default function Step3({ handleCancel }: { handleCancel: () => void }) {
  const [openCancelModal, setOpenCancelModal] = useState(false);

  return (
    <div className="max-h-[97%] pb-2 overflow-y-auto thin-scrollbar">
      <Form />

      <Buttons handleCancel={handleCancel} />

      <CancelModal
        handleCancel={() => setOpenCancelModal(false)}
        handleSubmit={handleCancel}
        isOpen={openCancelModal}
        setIsOpen={setOpenCancelModal}
      />
    </div>
  );
}
