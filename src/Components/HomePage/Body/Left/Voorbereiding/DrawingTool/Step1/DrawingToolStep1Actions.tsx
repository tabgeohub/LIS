import ClearButton from "./ClearButton";
import ConfirmButton from "./ConfirmButton";
import { motion } from "framer-motion";
import type { useDrawingToolStep1Model } from "./useDrawingToolStep1Model";

export function DrawingToolStep1Actions({
  model,
}: {
  model: ReturnType<typeof useDrawingToolStep1Model>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: 0.1 }}
      className="mt-4 flex justify-end gap-2"
    >
      <ClearButton onClear={model.handleClear} hasGraphics={model.hasGraphics} />
      <ConfirmButton
        graphicsLayer={model.graphicsLayer}
        hasGraphics={model.hasGraphics}
      />
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={model.handleCancel}
        className="px-3 py-2 rounded text-xs font-semibold transition-all duration-200 bg-gray-500 hover:bg-gray-600 text-white shadow-md hover:shadow-lg cursor-pointer"
      >
        {model.content.common.annuleren}
      </motion.button>
    </motion.div>
  );
}
