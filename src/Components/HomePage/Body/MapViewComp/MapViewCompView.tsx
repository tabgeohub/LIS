import { motion } from "framer-motion";
import { MapViewMapSection } from "./MapViewMapSection";
import { MapViewBottomSection } from "./MapViewBottomSection";
import type { useMapViewCompModel } from "./useMapViewCompModel";

type Model = ReturnType<typeof useMapViewCompModel>;

export function MapViewCompView(model: Model) {
  return (
    <motion.div
      ref={model.panel.containerRef}
      variants={{
        visible: { width: "100%", transition: { duration: 0.5 } },
        semiVisible: { width: "60%", transition: { duration: 0.5 } },
      }}
      initial="semiVisible"
      animate="visible"
      exit="semiVisible"
      className="relative h-full min-w-0 flex-1 overflow-hidden flex flex-col"
    >
      <MapViewMapSection {...model} />
      <MapViewBottomSection {...model} />
    </motion.div>
  );
}
