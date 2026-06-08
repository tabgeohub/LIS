import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { RiSquareFill } from "react-icons/ri";
import LegendSection from "../Common/LegendSection";

export default function Section1({
  parentChecked,
}: {
  parentChecked: boolean;
}) {
  return (
    <LegendSection
      externalParentChecked={parentChecked}
      nestedParentTitle="Wegen"
      gateNestedByRole
      initialLayers={[
        {
          id: "8.1.1",
          title: "Hectometerpaaltjes   ",
          checked: false,
          layer: new FeatureLayer({
            url: "https://geo.rijkswaterstaat.nl/arcgis/rest/services/GDR/nwb_wegen/FeatureServer/1",
            title: "Hectometerpaaltjes   ",
          }),
          icon: <RiSquareFill className="fill-green-400 size-2" />,
          regio: ["WNZ", "ZN"],
        },
        {
          id: "8.1.2",
          title: "Wegen   ",
          checked: false,
          layer: new FeatureLayer({
            url: "https://geo.rijkswaterstaat.nl/arcgis/rest/services/GDR/nwb_wegen/FeatureServer/2",
            title: "Wegen   ",
          }),
          icon: <div className="w-[80%] h-[2px] bg-gray-800 rounded-lg" />,
          regio: ["WNZ", "ON", "ZN"],
        },
      ]}
    />
  );
}
