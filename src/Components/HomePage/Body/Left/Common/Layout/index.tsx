import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BottomTabs from "../BottomTabs";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";

export default function Layout({
  children,
  bodyStyle,
}: {
  children: React.ReactNode;
  bodyStyle: React.CSSProperties;
}) {
  const { openSideBar } = useOpeSideBarState();

  // Draggable width state (px)
  const [sidebarWidthPx, setSidebarWidthPx] = useState<number>(() =>
    Math.round((typeof window !== "undefined" ? window.innerWidth : 1200) * 0.3)
  );

  // Drag handling
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
      const deltaX = e.clientX - dragRef.current.startX;
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
      {openSideBar && (
        <div style={bodyStyle} className="relative">
          <motion.div
            className="relative !h-[91%]"
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: sidebarWidthPx,
              opacity: 1,
              transition: { duration: 0.25 },
            }}
            exit={{ width: 0, opacity: 0, transition: { duration: 0.2 } }}
          >
            {children}

            {/* Vertical resize handle on right edge */}
            <div
              onMouseDown={(e) => {
                dragRef.current.dragging = true;
                dragRef.current.startX = e.clientX;
                dragRef.current.startWidth = sidebarWidthPx;
                document.body.style.userSelect = "none";
                document.body.style.cursor = "ew-resize";
              }}
              className="absolute top-0 right-0 h-full w-1 cursor-ew-resize bg-transparent hover:bg-primary/30 transition-colors"
              title="Versleep om de breedte van het paneel aan te passen"
            />
          </motion.div>

          <div className="absolute bottom-0 left-0 w-full !h-[8%] bg-gray-100">
            <BottomTabs />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
