import BasemapsList from "../Left/Common/KaartLegend/BasemapsList";
import { AnimatePresence, motion } from "framer-motion";
import type { MutableRefObject } from "react";

export function BasemapWidgetPanel(props: {
  open: boolean;
  panelRef: MutableRefObject<HTMLDivElement | null>;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {props.open && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 z-[999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.0 }}
            exit={{ opacity: 0 }}
            onClick={props.onClose}
          />
          <motion.div
            key="panel"
            ref={props.panelRef}
            className="absolute bottom-full left-0 mb-2 w-64 rounded-lg border bg-white shadow-lg pb-2 z-[1001]"
            initial={{
              opacity: 0,
              y: 8,
              scale: 0.98,
              transformOrigin: "bottom left",
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 32,
              mass: 0.6,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <BasemapsList usedPlace="Map" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
