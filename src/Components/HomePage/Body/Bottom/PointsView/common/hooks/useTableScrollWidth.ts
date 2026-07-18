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

function tableLengthSignature(
  params: Omit<UseTableScrollWidthParams, "tableScrollRef" | "tab">
) {
  return [
    params.pointsTableLength,
    params.flightPlansLength,
    params.geometriesTableLength,
    params.starredPointsLength,
    params.starredPlansLength,
    params.starredGeometriesLength,
  ].join("|");
}

export const useTableScrollWidth = ({
  tableScrollRef,
  tab,
  ...tableLengths
}: UseTableScrollWidthParams) => {
  const [tableScrollWidth, setTableScrollWidth] = useState(0);
  const [scrollContainerWidth, setScrollContainerWidth] = useState(0);
  const lengthKey = tableLengthSignature(tableLengths);

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
  }, [tableScrollRef, tab, lengthKey]);

  return { tableScrollWidth, scrollContainerWidth };
};
