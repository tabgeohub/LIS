import { useClickOutside } from "./useClickOutside";
import { usePointsViewLayoutAndGraphics } from "./usePointsViewLayoutAndGraphics";
import { useScrollOrResize } from "./useScrollOrResize";

export function usePointsViewSideEffects(input: {
  containerHeight: number;
  state: any;
  refs: any;
}) {
  useClickOutside({
    popupRef: input.refs.popupRef,
    setClickedPoint: input.state.setClickedPoint,
    setClickedPointPosition: input.state.setClickedPointPosition,
  });
  useScrollOrResize(input.state.setClickedPointPosition);
  return usePointsViewLayoutAndGraphics(input);
}
