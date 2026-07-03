export type UseTableLayoutInput = {
  containerHeight: number;
  headerHeight: number;
  tableScrollWidth: number;
  containerWidth: number;
};

export const useTableLayout = (input: UseTableLayoutInput) => {
  const availableHeight =
    input.containerHeight > 0
      ? Math.max(input.containerHeight - input.headerHeight, 0)
      : undefined;
  const needsHorizontalScroll =
    input.tableScrollWidth > 0 &&
    input.containerWidth > 0 &&
    input.tableScrollWidth > input.containerWidth;
  const horizontalScrollbarHeight = needsHorizontalScroll ? 18 : 0;
  const scrollAreaHeight =
    typeof availableHeight === "number"
      ? Math.max(availableHeight - horizontalScrollbarHeight, 0)
      : undefined;

  return {
    availableHeight,
    needsHorizontalScroll,
    horizontalScrollbarHeight,
    scrollAreaHeight,
  };
};
