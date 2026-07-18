import {
  usePointsViewRefs,
  usePointsViewUiState,
} from "./pointsViewStatePieces";

export function usePointsViewStateAndRefs() {
  return {
    state: usePointsViewUiState(),
    refs: usePointsViewRefs(),
  };
}
