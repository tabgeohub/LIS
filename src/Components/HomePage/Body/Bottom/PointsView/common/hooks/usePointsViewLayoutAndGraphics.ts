import { useOpenTable } from "hooks/zustand/ui/showTable";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { buildPointsViewLengths } from "./buildPointsViewLengths";
import { useMapGraphics } from "./useMapGraphics";
import { usePointsViewLayoutController } from "./usePointsViewLayoutController";

export function usePointsViewLayoutAndGraphics(input: {
  containerHeight: number;
  state: any;
  refs: any;
}) {
  const tables = useOpenTable();
  const mapState = useMapViewState();
  const layout = usePointsViewLayoutController({
    containerHeight: input.containerHeight,
    headerRef: input.refs.headerRef,
    tableScrollRef: input.refs.tableScrollRef,
    tab: input.state.tab,
    lengths: buildPointsViewLengths({ tables, state: input.state }),
  });
  useMapGraphics({
    tab: input.state.tab,
    ...tables,
    starredPoints: input.state.starredPoints,
    starredGeometries: input.state.starredGeometries,
    starredPlans: input.state.starredPlans,
    ...mapState,
    originalGraphicsMap: input.refs.originalGraphicsMap,
  });
  return { tables, layout };
}
