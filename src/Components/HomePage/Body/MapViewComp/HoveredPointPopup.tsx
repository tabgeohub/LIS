import { motion, AnimatePresence } from "framer-motion";
import { useHoveredGraphicState } from "@helpers/ZustandStates/hoveredGraphic";

export default function HoveredPointPopup() {
  const { hovered } = useHoveredGraphicState();

  return (
    <AnimatePresence>
      {hovered && (
        <motion.div
          initial={{ opacity: 0, x: 40, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 40, y: -10 }}
          transition={{ duration: 0.15 }}
          className="absolute top-3 right-3 z-[10001] bg-white/95 backdrop-blur rounded shadow px-3 py-2 border border-gray-200"
        >
          <p className="text-xs text-gray-600">Aandachtspunt</p>
          <p className="text-sm font-semibold text-gray-800 max-w-[240px] truncate">
            {hovered.label}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
