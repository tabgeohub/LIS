import { createDebouncedClickGuard } from "Components/HomePage/hooks/map/mapClickGuard";
import {
  handleMapClickHit,
  type MapClickListenerBase,
} from "./mapClickHitHandler";
import { clearSelectedPointGraphics } from "./pointHitSelection";

export type SetupClickListenerInput = MapClickListenerBase;

export const setupClickListener = (input: SetupClickListenerInput) => {
  const { mapView, selectedPointGraphicsLayer } = input;
  if (!mapView) return;

  const clickGuard = createDebouncedClickGuard();
  const clickHandler = mapView.on("click", async (event) => {
    await handleMapClickHit({
      ...input,
      event,
      shouldSkip: () => clickGuard.shouldSkip(),
      finishGuard: () => clickGuard.finish(),
    });
  });

  return () => {
    clearSelectedPointGraphics(selectedPointGraphicsLayer);
    clickHandler.remove();
  };
};
