import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { GiWindTurbine } from "react-icons/gi";

/** Layers 8.5 – 8.6 */
export const overigLayerSpecsPartA = [
  {
    id: "8.5",
    title: "Windturbenes",
    checked: false,
    icon: <GiWindTurbine />,
    layer: new MapImageLayer({
      url: "https://geo.rijkswaterstaat.nl/arcgis/rest/services/GDR/windenergiegebieden/MapServer?f=json&dpi=96&transparent=true&format=png8",
      title: "Windturbenes",
    }),
    regio: [],
  },
  {
    id: "8.6",
    title: "Vakken zandwinning",
    checked: false,
    layer: new FeatureLayer({
      url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/vakkenzandwinnning/FeatureServer",
      title: "Vakken zandwinning",
    }),
    icon: <div className="w-[80%] h-[2px] bg-yellow-500 rounded-lg" />,
    regio: ["MN"],
  },
];
