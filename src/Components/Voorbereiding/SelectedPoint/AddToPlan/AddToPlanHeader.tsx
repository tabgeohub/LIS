import { CgClose } from "react-icons/cg";

export function AddToPlanHeader(props: { onClose: () => void }) {
  return (
    <>
      <div className="flex justify-between items-center p-1">
        <p></p>
        <p className="text-gray-400">Aandachtspunt toevoegen</p>
        <button onClick={props.onClose}>
          <CgClose className="text-gray-400" />
        </button>
      </div>
      <div className="w-full h-[1px] bg-gray-200 mt-2" />
    </>
  );
}
