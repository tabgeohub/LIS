import LegendSection from "../Common/LegendSection";
import { NNEDERLAND_LAYERS } from "./nnederlandLayers";

export default function NNederland() {
  return (
    <LegendSection
      initialLayers={NNEDERLAND_LAYERS}
      parentTitle="NNederland"
      hideWhenEmpty
      syncFromSelectedLayers
    />
  );
}
