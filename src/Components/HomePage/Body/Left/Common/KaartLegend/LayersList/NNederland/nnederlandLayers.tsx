import { toLegendLayerDefinitions } from "./nnederlandLayerBuilders";
import { nnederlandLayerSpecsPart1 } from "./nnederlandLayerSpecsPart1";
import { nnederlandLayerSpecsPart2 } from "./nnederlandLayerSpecsPart2";
import { nnederlandLayerSpecsPart3 } from "./nnederlandLayerSpecsPart3";

export const NNEDERLAND_LAYERS = toLegendLayerDefinitions([
  ...nnederlandLayerSpecsPart1,
  ...nnederlandLayerSpecsPart2,
  ...nnederlandLayerSpecsPart3,
]);
