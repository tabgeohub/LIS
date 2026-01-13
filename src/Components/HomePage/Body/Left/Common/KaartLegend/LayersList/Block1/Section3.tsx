import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { useState } from "react";
import { FaRegSquareFull } from "react-icons/fa6";
import { useHandleLayerChange } from "../helpers/useHandleLayerChange";
import { LayerItem } from "../Common/LayerItem";
import { useAuth } from "@helpers/ZustandStates/useAuth";

export default function Section3() {
  const [layers, setLayers] = useState([
    // {
    //   id: "4",
    //   title: "Helikopterr (Live)",
    //   layer: null,
    //   checked: false,
    //   icon: <FaHelicopter />,
    //   regio: ["WNN", "ZN"],
    // },
    // {
    //   id: "5",
    //   title: "GPS Locaties (Live)",
    //   layer: null,
    //   checked: false,
    //   icon: <FaSquare className="fill-yellow-600 rotate-45 size-2" />,
    //   regio: ["WNN", "MN", "ON", "ZN"],
    // },
    // {
    //   id: "6",
    //   title: "GPS Locaties uitgevoerde vlucht",
    //   layer: null,
    //   checked: false,
    //   icon: <FaSquare className="fill-green-800 rotate-45 size-2" />,
    //   regio: ["WNN", "MN", "WNZ", "ON", "ZN"],
    // },
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
  ]);

  const handleLayerChange = useHandleLayerChange(setLayers);

  const { user } = useAuth();

  const filteredLayers =
    user.role === "admin"
      ? layers
      : layers.filter((layer) =>
          layer.regio?.includes(user.role.split(" ")[1])
        );

  return (
    <>
      {filteredLayers.map((layer) => (
        <LayerItem
          key={layer.id}
          layer={layer}
          onLayerChange={handleLayerChange}
        />
      ))}
    </>
  );
}
