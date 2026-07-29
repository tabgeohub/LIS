import { motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import type { PathPointType } from "hooks/zustand/ui/pathPointState";
import { PopupDetailsBody } from "./PopupDetailsBody";

export function MapPathPointPopup(input: {
  selectedPathPoint: PathPointType | null;
  setSelectedPathPoint: (point: PathPointType | null) => void;
}) {
  if (!input.selectedPathPoint) return null;
  return (
    <PopupDetails
      selectedPathPoint={input.selectedPathPoint}
      onClose={() => input.setSelectedPathPoint(null)}
    />
  );
}

function PopupDetails(input: {
  selectedPathPoint: PathPointType;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
      className="absolute top-4 right-4 bg-gray-100 p-4 rounded-lg shadow-lg min-w-[220px] z-50"
    >
      <PopupDetailsHeader onClose={input.onClose} />
      <PopupDetailsBody point={input.selectedPathPoint} />
    </motion.div>
  );
}

function PopupDetailsHeader(input: { onClose: () => void }) {
  return (
    <div className="flex justify-between items-center">
      <p className="font-semibold text-[15px] text-gray-700">Padpuntdetails</p>
      <button onClick={input.onClose} className="hover:scale-110 transition-all">
        <IoCloseOutline className="text-gray-700" />
      </button>
    </div>
  );
}
