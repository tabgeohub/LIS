import Modal from "Components/Common/Modal";
import ConfirmModalChrome from "Components/Common/ConfirmModalChrome";
import Step1 from "./Step1";

export default function Uploaden({
  openUploader,
  setOpenUploader,
}: {
  openUploader: boolean;
  setOpenUploader: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Modal
      className="w-full max-w-md rounded bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
      isOpen={openUploader}
      setIsOpen={setOpenUploader}
    >
      <ConfirmModalChrome
        title="Voeg gegevens toe aan de kaart"
        onClose={() => setOpenUploader(false)}
      >
        <Step1 />
      </ConfirmModalChrome>
    </Modal>
  );
}
