import { nnFeatureLayerSpec } from "./nnederlandLayerBuilders";
import { NN_MN_REGIO, NN_REGIO } from "./nnederlandLayerConstants";
import { nnSquareIcon } from "./nnederlandLayerIcons";

/** Layers 9.31 – 9.33 */
export const nnederlandLayerSpecsPart3d = [
  nnFeatureLayerSpec({
    id: "9.31",
    serviceName: "Kitesurfgebieden",
    title: "Kitesurfgebieden",
    icon: nnSquareIcon({ borderColor: "#000000", fillColor: "#e9d5ff", borderWidthPx: 1.5 }),
    regio: [...NN_MN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.32",
    serviceName: "Artikel20_2017",
    title: "Artikel20_2017",
    icon: nnSquareIcon({ borderColor: "#000000", fillColor: "#4ade80", borderWidthPx: 1.5 }),
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.33",
    serviceName: "Natura2000_NN",
    title: "Natura2000_NN",
    icon: nnSquareIcon({ borderColor: "#000000", fillColor: "#65a30d" }),
    regio: [...NN_REGIO],
  }),
];
