import { nnFeatureLayerSpec, nnMapImageLayerSpec } from "./nnederlandLayerBuilders";
import { NN_MN_REGIO, NN_REGIO } from "./nnederlandLayerConstants";
import { nnLineIcon, nnSquareIcon, nnederlandLayerIcons } from "./nnederlandLayerIcons";

/** Layers 9.12 – 9.22 */
export const nnederlandLayerSpecsPart2 = [
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
  nnFeatureLayerSpec({
    id: "9.15",
    serviceName: "Wadlooproutes",
    title: "Wadlooproutes",
    icon: nnLineIcon("#bbf7d0", 8),
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.16",
    serviceName: "Tycomkabel",
    title: "Tycomkabel",
    icon: nnLineIcon("#4ade80"),
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.17",
    serviceName: "NGTleiding",
    title: "NGTleiding",
    icon: nnLineIcon("#fb923c"),
    regio: [...NN_REGIO],
  }),
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
