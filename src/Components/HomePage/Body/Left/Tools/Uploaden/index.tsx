import Modal from "Components/HomePage/Body/Common/Modal";
import { IoMdClose } from "react-icons/io";
import Step1 from "./Step1";

export default function Uploaden({
  openUploader,
  setOpenUploader,
}: {
  openUploader: boolean;
  setOpenUploader: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      <Modal
        className="w-full max-w-md rounded bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
        isOpen={openUploader}
        setIsOpen={setOpenUploader}
      >
        <div className="relative">
          <div className="flex justify-between items-center px-2 py-2 border-b border-gray-200">
            <p className="text-gray-500 text-[16px] text-center">
              Voeg gegevens toe aan de kaart
            </p>
            <button onClick={() => setOpenUploader(false)}>
              <IoMdClose className="text-gray-500 text-lg" />
            </button>
          </div>
          <Step1 />
          <div className="w-full h-0.5 bg-gray-300" />
        </div>
      </Modal>
    </>
  );
}
