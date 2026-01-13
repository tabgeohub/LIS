import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LayersList from "../Left/Common/KaartLegend/LayersList";
import { IoLayers } from "react-icons/io5";

export default function LayersWidget() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <div className="absolute bottom-24 left-24 z-[1000]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-md bg-white gap-x-2 shadow-sm border p-1 flex items-center justify-center hover:bg-gray-50"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <IoLayers className="text-primary text-2xl" />
        <span className="text-primary">Layers</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 z-[999]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.0 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.div
              key="panel"
              ref={panelRef}
              className="absolute bottom-full left-0 mb-2 w-[400px] rounded-lg border bg-white shadow-lg pb-2 z-[1001]"
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
              onClick={(e) => e.stopPropagation()} // clicks inside panel won't bubble to button
            >
              <LayersList usedPlace="Map" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
