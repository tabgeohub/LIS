import { nnFeatureLayerSpec } from "./nnederlandLayerBuilders";
import { NN_REGIO } from "./nnederlandLayerConstants";
import { nnSquareIcon } from "./nnederlandLayerIcons";

/** Layers 9.29 – 9.30 */
export const nnederlandLayerSpecsPart3c = [
  nnFeatureLayerSpec({
    id: "9.29",
    serviceName: "Paviljoens",
    title: "Paviljoens",
    icon: nnSquareIcon({ borderColor: "#000000", fillColor: "#f97316" }),
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.30",
    serviceName: "Verspreidingsvakken",
    title: "Verspreidingsvakken",
    icon: nnSquareIcon({
      borderColor: "#000000",
      fillColor: "rgba(187, 247, 208, 0.5)",
      borderWidthPx: 1.5,
    }),
    regio: [...NN_REGIO],
  }),
];
