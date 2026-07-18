import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

/** Layer 8.7 */
export const overigLayerSpecsPartB = [
  {
    id: "8.7",
    title: "Vegunde vlakken zandwinning",
    checked: false,
    layer: new FeatureLayer({
      url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/vergunde_vlakken_zandwinning/FeatureServer",
      title: "Vegunde vlakken zandwinning",
    }),
    icon: (
      <div className="w-[70%] aspect-square bg-yellow-400 border border-black" />
    ),
    regio: ["MN"],
  },
];
