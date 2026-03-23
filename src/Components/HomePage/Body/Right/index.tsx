import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SelectedPlansPointsList from "./SelectedPlansPointsList";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useTimesliderState } from "@helpers/ZustandStates/useTimesliderState";

export default function Right({
  bodyStyle,
}: {
  bodyStyle: React.CSSProperties;
}) {
  const { selectedTab } = useTabState();
  const { selectedPlanIds } = useTimesliderState();
  const showPanel =
    selectedTab === "timeslider" && selectedPlanIds.length > 0;

  const [sidebarWidthPx, setSidebarWidthPx] = useState<number>(() =>
    Math.round((typeof window !== "undefined" ? window.innerWidth : 1200) * 0.28)
  );

  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startWidth: 0,
  });

  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current.dragging) return;
      const deltaX = dragRef.current.startX - e.clientX;
      const next = clamp(
        dragRef.current.startWidth + deltaX,
        260,
        Math.max(360, (window.innerWidth * 0.6) | 0)
      );
      setSidebarWidthPx(next);
    };
    const onUp = () => {
      if (!dragRef.current.dragging) return;
      dragRef.current.dragging = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <AnimatePresence>
      {showPanel && (
        <div style={bodyStyle} className="relative flex-shrink-0">
          <motion.div
            className="relative !h-full bg-white border-l border-gray-200 shadow-lg"
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: sidebarWidthPx,
              opacity: 1,
              transition: { duration: 0.25 },
            }}
            exit={{ width: 0, opacity: 0, transition: { duration: 0.2 } }}
          >
            <SelectedPlansPointsList />

            <div
              onMouseDown={(e) => {
                dragRef.current.dragging = true;
                dragRef.current.startX = e.clientX;
                dragRef.current.startWidth = sidebarWidthPx;
                document.body.style.userSelect = "none";
                document.body.style.cursor = "ew-resize";
              }}
              className="absolute top-0 left-0 h-full w-1 cursor-ew-resize bg-transparent hover:bg-primary/30 transition-colors"
              title="Versleep om de breedte van het paneel aan te passen"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
