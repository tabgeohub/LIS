import { nnFeatureLayerSpec } from "./nnederlandLayerBuilders";
import { NN_REGIO } from "./nnederlandLayerConstants";
import { nnSquareIcon } from "./nnederlandLayerIcons";

/** Layers 9.21 – 9.22 */
export const nnederlandLayerSpecsPart2d = [
  nnFeatureLayerSpec({
    id: "9.21",
    serviceName: "Pierenwinning",
    title: "Pierenwinning",
    icon: nnSquareIcon({ borderColor: "#000000", fillColor: "#fbcfe8", borderWidthPx: 1.5 }),
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.22",
    serviceName: "MZI_installaties2018",
    title: "MZI_installaties2018",
    icon: nnSquareIcon({ borderColor: "#000000", fillColor: "#fed7aa" }),
    regio: [...NN_REGIO],
  }),
];
