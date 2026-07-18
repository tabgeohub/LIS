import { nnFeatureLayerSpec } from "./nnederlandLayerBuilders";
import { NN_REGIO } from "./nnederlandLayerConstants";
import { nnSquareIcon, nnederlandLayerIcons } from "./nnederlandLayerIcons";

/** Layers 9.26 – 9.28 */
export const nnederlandLayerSpecsPart3b = [
  nnFeatureLayerSpec({
    id: "9.26",
    serviceName: "Bruggen_Sluizen_HLD",
    title: "Bruggen_Sluizen_HLD",
    icon: nnederlandLayerIcons.bruggenSluizen,
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.27",
    serviceName: "BeheersgrensHLD",
    title: "BeheersgrensHLD",
    icon: nnSquareIcon({ borderColor: "#000000", fillColor: "#a855f7" }),
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.28",
    serviceName: "Waterregeling",
    title: "Waterregeling",
    icon: nnSquareIcon({ borderColor: "#000000", fillColor: "#fef08a" }),
    regio: [...NN_REGIO],
  }),
];
