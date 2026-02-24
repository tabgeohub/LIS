import { RefObject } from "react";
import { scrollHorizontally } from "../functions/scrollHorizontally";
import { syncScrollPositions } from "../functions/syncScrollPositions";

interface HorizontalScrollControlsProps {
  needsHorizontalScroll: boolean;
  tableScrollWidth: number;
  topScrollRef: RefObject<HTMLDivElement>;
  tableScrollRef: RefObject<HTMLDivElement>;
  syncingRef: RefObject<boolean>;
  onTopScroll?: () => void;
}

export default function HorizontalScrollControls({
  needsHorizontalScroll,
  tableScrollWidth,
  topScrollRef,
  tableScrollRef,
  syncingRef,
  onTopScroll,
}: HorizontalScrollControlsProps) {
  if (!needsHorizontalScroll) return null;

  const handleTopScroll = () => {
    syncScrollPositions("top", topScrollRef, tableScrollRef, syncingRef);
    if (onTopScroll) onTopScroll();
  };

  return (
    <div className="flex items-center gap-2 mb-1">
      <button
        type="button"
        onClick={() => scrollHorizontally("left", tableScrollRef, topScrollRef)}
        className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
      >
        ←
      </button>
      <div
        ref={topScrollRef}
        onScroll={handleTopScroll}
        className="h-4 flex-1 overflow-x-auto thin-scrollbar"
      >
        <div
          style={{
            width: `${tableScrollWidth}px`,
            height: "4px",
          }}
        />
      </div>
      <button
        type="button"
        onClick={() =>
          scrollHorizontally("right", tableScrollRef, topScrollRef)
        }
        className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
      >
        →
      </button>
    </div>
  );
}

