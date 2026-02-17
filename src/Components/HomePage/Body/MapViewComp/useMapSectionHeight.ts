import { useEffect, useMemo, useRef, useState } from "react";

interface UseMapSectionHeightParams {
  openTable: boolean;
  panelVh: number;
}

/**
 * Custom hook to calculate the dynamic height of the map section
 * based on whether the bottom table panel is open and its size.
 * 
 * @param openTable - Whether the bottom table panel is open
 * @param panelVh - The height of the bottom panel in viewport height units (vh)
 * @returns An object containing the container ref and the calculated map section height
 */
export default function useMapSectionHeight({
  openTable,
  panelVh,
}: UseMapSectionHeightParams) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  // Measure parent container height for dynamic map height calculation
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateHeight = () => {
      const height = element.offsetHeight;
      setContainerHeight(height);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Map section height depends on whether the bottom panel is open
  const mapSectionHeight = useMemo(() => {
    if (!openTable) {
      // When table is closed, use full container height (100% of parent)
      return "100%";
    }
    // When table is open, the map takes the remaining height
    // Calculate: container height - panel height in pixels
    // panelVh is in viewport height units, so convert to pixels
    const panelHeightPx = (panelVh / 100) * window.innerHeight;
    const remainingHeight = Math.max(0, containerHeight - panelHeightPx);
    // Fallback to 100% if containerHeight hasn't been measured yet
    return containerHeight > 0 ? `${remainingHeight}px` : "100%";
  }, [openTable, panelVh, containerHeight]);

  return {
    containerRef,
    mapSectionHeight,
  };
}

