export type UseTableLayoutInput = {
  containerHeight: number;
  headerHeight: number;
  tableScrollWidth: number;
  containerWidth: number;
};

function computeAvailableHeight(
  containerHeight: number,
  headerHeight: number
): number | undefined {
  if (containerHeight <= 0) return undefined;
  return Math.max(containerHeight - headerHeight, 0);
}

function needsHorizontalScroll(
  tableScrollWidth: number,
  containerWidth: number
): boolean {
  return (
    tableScrollWidth > 0 &&
    containerWidth > 0 &&
    tableScrollWidth > containerWidth
  );
}

function computeScrollAreaHeight(
  availableHeight: number | undefined,
  horizontalScrollbarHeight: number
): number | undefined {
  if (typeof availableHeight !== "number") return undefined;
  return Math.max(availableHeight - horizontalScrollbarHeight, 0);
}

export const useTableLayout = (input: UseTableLayoutInput) => {
  const availableHeight = computeAvailableHeight(
    input.containerHeight,
    input.headerHeight
  );
  const scrollNeeded = needsHorizontalScroll(
    input.tableScrollWidth,
    input.containerWidth
  );
  const horizontalScrollbarHeight = scrollNeeded ? 18 : 0;

  return {
    availableHeight,
    needsHorizontalScroll: scrollNeeded,
    horizontalScrollbarHeight,
    scrollAreaHeight: computeScrollAreaHeight(
      availableHeight,
      horizontalScrollbarHeight
    ),
  };
};
