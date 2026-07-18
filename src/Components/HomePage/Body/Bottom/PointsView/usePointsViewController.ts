import { usePointsViewInteractions } from "./common/hooks/usePointsViewInteractions";
import { usePointsViewSideEffects } from "./common/hooks/usePointsViewSideEffects";
import { usePointsViewStateAndRefs } from "./common/hooks/usePointsViewStateAndRefs";
import { toPointsViewControllerResult } from "./toPointsViewControllerResult";

export function usePointsViewController(containerHeight: number) {
  const { state, refs } = usePointsViewStateAndRefs();
  const { tables, layout } = usePointsViewSideEffects({
    containerHeight,
    state,
    refs,
  });
  const interactions = usePointsViewInteractions({
    draggingCol: state.draggingCol,
    setDraggingCol: state.setDraggingCol,
    topScrollRef: refs.topScrollRef,
    tableScrollRef: refs.tableScrollRef,
    syncingRef: refs.syncingRef,
  });
  return toPointsViewControllerResult({ state, refs, tables, layout, interactions });
}
