import { nnFeatureLayerSpec } from "./nnederlandLayerBuilders";
import { NN_MN_REGIO, NN_REGIO } from "./nnederlandLayerConstants";
import { nnLineIcon, nnederlandLayerIcons } from "./nnederlandLayerIcons";

/** Layers 9.1 – 9.11 */
export const nnederlandLayerSpecsPart1 = [
  nnFeatureLayerSpec({
    id: "9.1",
    serviceName: "Betonning_Totaal",
    title: "Betonning Totaal",
    icon: nnederlandLayerIcons.betonning,
    regio: [...NN_MN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.2",
    serviceName: "ARZ",
    title: "ARZ",
    icon: nnederlandLayerIcons.arz,
  }),
  nnFeatureLayerSpec({
    id: "9.3",
    serviceName: "Strandpaviljoens",
    title: "Strandpaviljoens",
    icon: nnederlandLayerIcons.strandpaviljoens,
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.4",
    serviceName: "Strandpalen",
    title: "Strandpalen",
    icon: nnederlandLayerIcons.strandpalen,
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.5",
    serviceName: "Damnummers",
    title: "Damnummers",
    icon: nnederlandLayerIcons.damnummers,
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.6",
    serviceName: "Lozingspunten",
    title: "Lozingspunten",
    icon: nnederlandLayerIcons.lozingspunten,
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.7",
    serviceName: "Vloeistofleidingen",
    title: "Vloestofleidingen",
    icon: nnLineIcon("#1e40af"),
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.8",
    serviceName: "DataTelecom",
    title: "DataTelecom",
    icon: nnLineIcon("#4ade80"),
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.9",
    serviceName: "Electrkabels",
    title: "Electrkabels",
    icon: nnLineIcon("#ef4444"),
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.10",
    serviceName: "Gasleidingen",
    title: "Gasleidingen",
    icon: nnLineIcon("#f97316"),
    regio: [...NN_REGIO],
  }),
  nnFeatureLayerSpec({
    id: "9.11",
    serviceName: "Primaire_keringen",
    title: "Primaire_keringen",
    icon: nnLineIcon("#22c55e", 7),
    regio: [...NN_MN_REGIO],
  }),
];
