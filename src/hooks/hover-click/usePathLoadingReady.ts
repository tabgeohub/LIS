import { useEffect } from "react";

export function usePathLoadingReady(input: {
  loadingPath: boolean;
  setLoadingPath: (value: boolean) => void;
  finishedPlanLoading: boolean;
  hasPath: boolean;
  pathLayerReady: boolean;
  pointsGraphicsLayer?: __esri.GraphicsLayer | null;
  expectedPointsCount: number;
}) {
  useEffect(() => {
    if (!input.loadingPath) return;

    const fallbackTimeout = window.setTimeout(() => {
      input.setLoadingPath(false);
    }, 3000);

    if (input.finishedPlanLoading || !input.hasPath || !input.pathLayerReady) {
      return () => window.clearTimeout(fallbackTimeout);
    }

    const finishIfReady = () => {
      if (!input.pointsGraphicsLayer || input.expectedPointsCount === 0) {
        input.setLoadingPath(false);
        return;
      }

      if (input.pointsGraphicsLayer.graphics.length >= input.expectedPointsCount) {
        input.setLoadingPath(false);
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(finishIfReady);
    });

    return () => window.clearTimeout(fallbackTimeout);
  }, [
    input.loadingPath,
    input.finishedPlanLoading,
    input.hasPath,
    input.pathLayerReady,
    input.pointsGraphicsLayer,
    input.expectedPointsCount,
    input.setLoadingPath,
  ]);
}
