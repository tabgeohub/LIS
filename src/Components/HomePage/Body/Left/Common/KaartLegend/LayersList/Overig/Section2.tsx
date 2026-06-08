import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import { FcList } from "react-icons/fc";
import LegendSection from "../Common/LegendSection";

export default function Section2({
  parentChecked,
}: {
  parentChecked: boolean;
}) {
  return (
    <LegendSection
      externalParentChecked={parentChecked}
      initialLayers={[
        {
          id: "8.2",
          title: "Markeringen",
          checked: false,
          layer: new MapImageLayer({
            url: "https://geo.rijkswaterstaat.nl/arcgis/rest/services/GDR/vaarweg_markeringen/MapServer",
            title: "Markeringen",
            sublayers: [{ id: 1 }],
          }),
          icon: <FcList />,
          regio: ["MN"],
        },
        {
          id: "8.3",
          title: "Vaarwegen",
          checked: false,
          layer: new FeatureLayer({
            url: "https://geo.rijkswaterstaat.nl/arcgis/rest/services/GDR/fis_vnds/FeatureServer/55",
            visible: true,
            title: "Vaarwegen",
          }),
          icon: <div className="w-[80%] h-[2px] bg-blue-300 rounded-lg" />,
          regio: ["MN", "ON", "ZN"],
        },
      ]}
    />
  );
}
