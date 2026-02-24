import { useState, useEffect, RefObject } from "react";

interface UseTableScrollWidthParams {
  tableScrollRef: RefObject<HTMLDivElement>;
  tab: string;
  pointsTableLength: number;
  flightPlansLength: number;
  geometriesTableLength: number;
  containerWidth: number;
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
  containerWidth,
  starredPointsLength,
  starredPlansLength,
  starredGeometriesLength,
}: UseTableScrollWidthParams) => {
  const [tableScrollWidth, setTableScrollWidth] = useState(0);

  useEffect(() => {
    const wrapper = tableScrollRef.current;
    if (!wrapper) {
      setTableScrollWidth(0);
      return;
    }

    const tableEl = wrapper.querySelector("table");
    if (!tableEl) {
      setTableScrollWidth(0);
      return;
    }

    const updateWidth = () => {
      setTableScrollWidth(tableEl.scrollWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(tableEl);

    return () => observer.disconnect();
  }, [
    tableScrollRef,
    tab,
    pointsTableLength,
    flightPlansLength,
    geometriesTableLength,
    containerWidth,
    starredPointsLength,
    starredPlansLength,
    starredGeometriesLength,
  ]);

  return tableScrollWidth;
};

