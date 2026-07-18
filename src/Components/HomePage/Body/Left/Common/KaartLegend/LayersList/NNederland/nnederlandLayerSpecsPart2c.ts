import { nnFeatureLayerSpec } from "./nnederlandLayerBuilders";
import { NN_REGIO } from "./nnederlandLayerConstants";
import { nnLineIcon, nnederlandLayerIcons } from "./nnederlandLayerIcons";

/** Layers 9.18 – 9.20 */
export const nnederlandLayerSpecsPart2c = [
  nnFeatureLayerSpec({
    id: "9.18",
    serviceName: "NorNedkabel",
    title: "NorNedkabel",
    icon: nnLineIcon("#ef4444"),
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.19",
    serviceName: "Kwelderdammen",
    title: "Kwelderdammen",
    icon: nnederlandLayerIcons.kwelderdammen,
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.20",
    serviceName: "Eemsverdrag",
    title: "Eemsverdrag",
    icon: nnederlandLayerIcons.eemsverdrag,
    regio: [...NN_REGIO],
  }),
];
