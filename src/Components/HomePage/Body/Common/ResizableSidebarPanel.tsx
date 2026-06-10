import { AnimatePresence, motion } from "framer-motion";
import {
  ResizeHandleSide,
  useResizableSidebar,
} from "hooks/layout/useResizableSidebar";

const RESIZE_HANDLE_TITLE = "Versleep om de breedte van het paneel aan te passen";

export default function ResizableSidebarPanel({
  visible,
  bodyStyle,
  wrapperClassName,
  panelClassName,
  handleSide,
  initialWidthRatio,
  footer,
  children,
}: {
  visible: boolean;
  bodyStyle: React.CSSProperties;
  wrapperClassName?: string;
  panelClassName?: string;
  handleSide: ResizeHandleSide;
  initialWidthRatio: number;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { sidebarWidthPx, onResizeMouseDown } = useResizableSidebar(
    initialWidthRatio,
    handleSide
  );

  const handlePositionClass =
    handleSide === "right" ? "right-0" : "left-0";

  return (
    <AnimatePresence>
      {visible && (
        <div style={bodyStyle} className={wrapperClassName}>
          <motion.div
            className={panelClassName}
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: sidebarWidthPx,
              opacity: 1,
              transition: { duration: 0.25 },
            }}
            exit={{ width: 0, opacity: 0, transition: { duration: 0.2 } }}
          >
            {children}

            <div
              onMouseDown={(e) => onResizeMouseDown(e.clientX)}
              className={`absolute top-0 ${handlePositionClass} h-full w-1 cursor-ew-resize bg-transparent hover:bg-primary/30 transition-colors`}
              title={RESIZE_HANDLE_TITLE}
            />
          </motion.div>

          {footer}
        </div>
      )}
    </AnimatePresence>
  );
}
