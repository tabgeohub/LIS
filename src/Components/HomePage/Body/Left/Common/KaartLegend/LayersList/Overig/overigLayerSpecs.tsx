import { overigLayerSpecsPartA } from "./overigLayerSpecsPartA";
import { overigLayerSpecsPartB } from "./overigLayerSpecsPartB";
import { overigLayerSpecsPartBd } from "./overigLayerSpecsPartBd";
import { overigLayerSpecsPartC } from "./overigLayerSpecsPartC";

export function createOverigLayerSpecs() {
  return [
    ...overigLayerSpecsPartA,
    ...overigLayerSpecsPartB,
    ...overigLayerSpecsPartBd,
    ...overigLayerSpecsPartC,
  ];
}
