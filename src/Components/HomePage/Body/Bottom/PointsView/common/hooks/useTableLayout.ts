export const useTableLayout = (
  containerHeight: number,
  headerHeight: number,
  tableScrollWidth: number,
  containerWidth: number
) => {
  const availableHeight =
    containerHeight > 0
      ? Math.max(containerHeight - headerHeight, 0)
      : undefined;
  const needsHorizontalScroll =
    tableScrollWidth > 0 &&
    containerWidth > 0 &&
    tableScrollWidth > containerWidth;
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

