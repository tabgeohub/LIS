import { useState, useEffect, RefObject } from "react";

interface UseTableScrollWidthParams {
  tableScrollRef: RefObject<HTMLDivElement>;
  tab: string;
  pointsTableLength: number;
  flightPlansLength: number;
  geometriesTableLength: number;
  starredPointsLength: number;
  starredPlansLength: number;
  starredGeometriesLength: number;
}

export const useTableScrollWidth = ({
  tableScrollRef,
  tab,
  pointsTableLength,
  flightPlansLength,
  geometriesTableLength,
  starredPointsLength,
  starredPlansLength,
  starredGeometriesLength,
}: UseTableScrollWidthParams) => {
  const [tableScrollWidth, setTableScrollWidth] = useState(0);
  const [scrollContainerWidth, setScrollContainerWidth] = useState(0);

  useEffect(() => {
    const wrapper = tableScrollRef.current;
    if (!wrapper) {
      setTableScrollWidth(0);
      setScrollContainerWidth(0);
      return;
    }

    const updateWidths = () => {
      const tableEl = wrapper.querySelector("table");
      setScrollContainerWidth(wrapper.clientWidth);
      setTableScrollWidth(tableEl?.scrollWidth ?? 0);
    };

    updateWidths();

    const observer = new ResizeObserver(updateWidths);
    observer.observe(wrapper);
    const tableEl = wrapper.querySelector("table");
    if (tableEl) observer.observe(tableEl);

    return () => observer.disconnect();
  }, [
    tableScrollRef,
    tab,
    pointsTableLength,
    flightPlansLength,
    geometriesTableLength,
    starredPointsLength,
    starredPlansLength,
    starredGeometriesLength,
  ]);

  return { tableScrollWidth, scrollContainerWidth };
};
