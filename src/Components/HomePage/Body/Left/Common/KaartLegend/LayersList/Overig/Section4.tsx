import LegendSection from "../Common/LegendSection";
import { createOverigLayerSpecs } from "./overigLayerSpecs";

export default function Section4({ parentChecked }: { parentChecked: boolean }) {
  return (
    <LegendSection
      externalParentChecked={parentChecked}
      initialLayers={createOverigLayerSpecs()}
    />
  );
}
