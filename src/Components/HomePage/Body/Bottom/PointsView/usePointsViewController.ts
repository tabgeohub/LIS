import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { handleDragOver } from "./common/functions/columnDragHandlers";
import { useClickOutside } from "./common/hooks/useClickOutside";
import { useMapGraphics } from "./common/hooks/useMapGraphics";
import { usePointsViewInteractions } from "./common/hooks/usePointsViewInteractions";
import { usePointsViewLayoutController } from "./common/hooks/usePointsViewLayoutController";
import { usePointsViewStateAndRefs } from "./common/hooks/usePointsViewStateAndRefs";
import { useScrollOrResize } from "./common/hooks/useScrollOrResize";

export function usePointsViewController(containerHeight: number) {
  const { state, refs } = usePointsViewStateAndRefs();
  const tables = useOpenTable();
  const mapState = useMapViewState();

  useClickOutside({
    popupRef: refs.popupRef,
    setClickedPoint: state.setClickedPoint,
    setClickedPointPosition: state.setClickedPointPosition,
  });
  useScrollOrResize(state.setClickedPointPosition);

  const layout = usePointsViewLayoutController({
    containerHeight,
    headerRef: refs.headerRef,
    tableScrollRef: refs.tableScrollRef,
    tab: state.tab,
    lengths: {
      points: tables.pointsTable.length,
      plans: tables.flightPlans.length,
      geometries: tables.geometriesTable.length,
      starredPoints: state.starredPoints.length,
      starredPlans: state.starredPlans.length,
      starredGeometries: state.starredGeometries.length,
    },
  });

  useMapGraphics({
    tab: state.tab,
    ...tables,
    starredPoints: state.starredPoints,
    starredGeometries: state.starredGeometries,
    starredPlans: state.starredPlans,
    ...mapState,
    originalGraphicsMap: refs.originalGraphicsMap,
  });

  const interactions = usePointsViewInteractions({
    draggingCol: state.draggingCol,
    setDraggingCol: state.setDraggingCol,
    topScrollRef: refs.topScrollRef,
    tableScrollRef: refs.tableScrollRef,
    syncingRef: refs.syncingRef,
  });

  const { draggingCol: _draggingCol, setDraggingCol: _setDraggingCol, ...publicState } = state;
  return {
    ...publicState,
    ...tables,
    ...refs,
    ...layout,
    ...interactions,
    handleDragOver,
  };
}
