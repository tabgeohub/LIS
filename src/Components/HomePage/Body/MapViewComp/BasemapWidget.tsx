import { useEffect, useRef, useState } from "react";
import BasemapsList from "../Left/Common/KaartLegend/BasemapsList";
import { useSelectedBasemapState } from "hooks/kaartlagen/useBasemapStore";
import { AnimatePresence, motion } from "framer-motion";

export default function BasemapWidget() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { basemap } = useSelectedBasemapState();

  const thumbnails: Record<"topo-vector" | "luchtfoto" | "open-topo", string> =
    {
      "topo-vector": "/basemaps/topo-vector.png",
      luchtfoto: "/basemaps/luchtfoto.png",
      "open-topo": "/basemaps/open-topo.png",
    };

  const labels: Record<keyof typeof thumbnails, string> = {
    "topo-vector": "Topo Vector",
    luchtfoto: "Luchtfoto",
    "open-topo": "Open Topo",
  };

  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <div className="absolute bottom-24 left-6 z-[10]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-md bg-white shadow-sm border p-1 flex items-center justify-center hover:bg-gray-50"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Basemap: ${
          labels[basemap as keyof typeof labels] ?? "select"
        }`}
        title={labels[basemap as keyof typeof labels] ?? "Basemap"}
      >
        <img
          src={
            thumbnails[basemap as keyof typeof thumbnails] ??
            "/basemaps/topo-vector.png"
          }
          alt={labels[basemap as keyof typeof labels] ?? "Basemap"}
          className="h-14 w-14 rounded border object-cover"
          draggable={false}
        />
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
              onClick={(e) => e.stopPropagation()} // clicks inside panel won't bubble to button
            >
              <BasemapsList usedPlace="Map" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
