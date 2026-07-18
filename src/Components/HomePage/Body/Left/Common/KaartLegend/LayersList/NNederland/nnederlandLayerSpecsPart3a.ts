import { nnFeatureLayerSpec } from "./nnederlandLayerBuilders";
import { NN_REGIO } from "./nnederlandLayerConstants";
import { nnSquareIcon } from "./nnederlandLayerIcons";

/** Layers 9.23 – 9.25 */
export const nnederlandLayerSpecsPart3a = [
  nnFeatureLayerSpec({
    id: "9.23",
    serviceName: "MZI_locaties2018",
    title: "MZI_locaties",
    icon: nnSquareIcon({ borderColor: "#000000", fillColor: "#e9d5ff", borderWidthPx: 1.5 }),
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.24",
    serviceName: "Mosselpercelen",
    title: "Mosselpercelen",
    icon: nnSquareIcon({ borderColor: "#000000", fillColor: "#bfdbfe" }),
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.25",
    serviceName: "Schelpenwinning",
    title: "Schelpenwinning",
    icon: nnSquareIcon({ borderColor: "#000000", fillColor: "#fbcfe8", borderWidthPx: 1.5 }),
    regio: [...NN_REGIO],
  }),
];
