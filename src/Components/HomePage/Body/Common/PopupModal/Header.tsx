import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import useHandleClosePopUp from "hooks/popUpModal/useHandleClosePopUp";
import { CgClose } from "react-icons/cg";

export default function Header({
  setOpenModal,
}: {
  setOpenModal: (value: boolean) => void;
}) {
  const { clickedPoint } = usePopUpState();

  const handleClose = useHandleClosePopUp();

  return (
    <div className="flex justify-between items-center">
      <p className="text-gray-800 text-lg">
        {clickedPoint.id !== 0 && clickedPoint.omschrijving}
      </p>

      <button onClick={handleClose}>
        <CgClose className="text-gray-400" />
      </button>
    </div>
  );
}
