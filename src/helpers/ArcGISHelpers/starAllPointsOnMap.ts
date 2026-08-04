import { EnrichedPointType } from "Types";
import {
  getUnstarredPoints,
  mergeStarredPoints,
} from "@helpers/points/starredPointSelection";
import { addStarPointGraphics } from "./starPointGraphicsActions";

export function starAllPointsOnMap({
  points,
  starredPoints,
  setStarredPoints,
  graphicsLayer,
}: {
  points: EnrichedPointType[];
  starredPoints: EnrichedPointType[];
  setStarredPoints: (value: EnrichedPointType[]) => void;
  graphicsLayer: __esri.GraphicsLayer | null | undefined;
}) {
  if (!graphicsLayer) return;

  const newStars = getUnstarredPoints(points, starredPoints);
  setStarredPoints(mergeStarredPoints(starredPoints, newStars));
  addStarPointGraphics(newStars, graphicsLayer);
}
