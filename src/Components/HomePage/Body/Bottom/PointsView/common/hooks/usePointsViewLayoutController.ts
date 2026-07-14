import { useHeaderHeight } from "./useHeaderHeight";
import { useTableLayout } from "./useTableLayout";
import { useTableScrollWidth } from "./useTableScrollWidth";

export function usePointsViewLayoutController(input: {
  containerHeight: number;
  headerRef: React.RefObject<HTMLDivElement>;
  tableScrollRef: React.RefObject<HTMLDivElement>;
  tab: string;
  lengths: {
    points: number;
    plans: number;
    geometries: number;
    starredPoints: number;
    starredPlans: number;
    starredGeometries: number;
  };
}) {
  const headerHeight = useHeaderHeight(input.headerRef);
  const { tableScrollWidth, scrollContainerWidth } = useTableScrollWidth({
    tableScrollRef: input.tableScrollRef,
    tab: input.tab,
    pointsTableLength: input.lengths.points,
    flightPlansLength: input.lengths.plans,
    geometriesTableLength: input.lengths.geometries,
    starredPointsLength: input.lengths.starredPoints,
    starredPlansLength: input.lengths.starredPlans,
    starredGeometriesLength: input.lengths.starredGeometries,
  });
  return {
    tableScrollWidth,
    ...useTableLayout({
      containerHeight: input.containerHeight,
      headerHeight,
      tableScrollWidth,
      containerWidth: scrollContainerWidth,
    }),
  };
}
