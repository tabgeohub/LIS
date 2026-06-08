import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { FaRegSquareFull } from "react-icons/fa6";
import LegendSection from "../Common/LegendSection";

export default function Section3() {
  return (
    <LegendSection
      initialLayers={[
        {
          id: "7",
          title: "Regios",
          layer: new FeatureLayer({
            url: "https://geo.rijkswaterstaat.nl/arcgis/rest/services/GDR/regiogebieden_rijkswaterstaat/FeatureServer/0",
            title: "Regios",
          }),
          checked: false,
          icon: <FaRegSquareFull className="fill-purple-500" />,
          regio: ["ON"],
        },
      ]}
    />
  );
}
