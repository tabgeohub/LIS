import { nnFeatureLayerSpec } from "./nnederlandLayerBuilders";
import { NN_MN_REGIO, NN_REGIO } from "./nnederlandLayerConstants";
import { nnSquareIcon, nnederlandLayerIcons } from "./nnederlandLayerIcons";

/** Layers 9.23 – 9.33 */
export const nnederlandLayerSpecsPart3 = [
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
