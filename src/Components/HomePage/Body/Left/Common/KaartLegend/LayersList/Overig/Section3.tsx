import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { GiPylon } from "react-icons/gi";
import LegendSection from "../Common/LegendSection";

export default function Section3({
  parentChecked,
}: {
  parentChecked: boolean;
}) {
  return (
    <LegendSection
      externalParentChecked={parentChecked}
      nestedParentTitle="Hoogspanningsmasten"
      gateNestedByRole
      initialLayers={[
        {
          id: "8.4.1",
          title: "Hoogspanningsmasten   ",
          checked: false,
          layer: new FeatureLayer({
            url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Hoogspanningsmasten/FeatureServer",
            title: "Hoogspanningsmasten   ",
          }),
          icon: <GiPylon />,
          regio: [""],
        },
        {
          id: "8.4.2",
          title: "Hoogspanningsleidingen   ",
          checked: false,
          layer: new FeatureLayer({
            url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Hoogspanningsleidingen/FeatureServer",
            title: "Hoogspanningsleidingen   ",
          }),
          icon: <div className="w-[80%] h-[2px] bg-gray-700 rounded-lg" />,
          regio: [""],
        },
      ]}
    />
  );
}
