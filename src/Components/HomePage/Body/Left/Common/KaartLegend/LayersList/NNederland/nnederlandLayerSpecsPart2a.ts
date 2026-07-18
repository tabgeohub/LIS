import { nnFeatureLayerSpec, nnMapImageLayerSpec } from "./nnederlandLayerBuilders";
import { NN_MN_REGIO, NN_REGIO } from "./nnederlandLayerConstants";
import { nnLineIcon } from "./nnederlandLayerIcons";

/** Layers 9.12 – 9.14 */
export const nnederlandLayerSpecsPart2a = [
  nnMapImageLayerSpec({
    id: "9.12",
    url: "https://geo.rijkswaterstaat.nl/arcgis/rest/services/GDR/nwb_wegen/MapServer/2",
    title: "Vaarwegen",
    icon: nnLineIcon("#1d4ed8"),
    regio: [...NN_MN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.13",
    serviceName: "Snelvaren",
    title: "Snelvaren",
    icon: nnLineIcon("#bfdbfe"),
    regio: [...NN_MN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.14",
    serviceName: "Strandovergangen",
    title: "Strandovergangen",
    icon: nnLineIcon("#fef08a", 6),
    regio: [...NN_REGIO],
  }),
];
