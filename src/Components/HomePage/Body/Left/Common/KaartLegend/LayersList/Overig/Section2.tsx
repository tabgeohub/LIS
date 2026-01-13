/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { FcList } from "react-icons/fc";
import { LayerItem } from "../Common/LayerItem";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import { useHandleLayerChange } from "../helpers/useHandleLayerChange";
import { useAuth } from "@helpers/ZustandStates/useAuth";

export default function Section2({
  parentChecked,
}: {
  parentChecked: boolean;
}) {
  const [layers, setLayers] = useState([
    {
      id: "8.2",
      title: "Markeringen",
      checked: false,
      layer: new MapImageLayer({
        url: "https://geo.rijkswaterstaat.nl/arcgis/rest/services/GDR/vaarweg_markeringen/MapServer",
        title: "Markeringen",

        sublayers: [
          {
            id: 1,
          },
        ],
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
  ]);

  const handleLayerChange = useHandleLayerChange(setLayers);

  const { user } = useAuth();

  const filteredLayers =
    user.role === "admin"
      ? layers
      : layers.filter((layer) =>
          layer.regio?.includes(user.role.split(" ")[1])
        );

  useEffect(() => {
    if (!parentChecked) {
      const unchcekedLayers = layers.map((layer) => ({
        ...layer,
        checked: false,
      }));
      setLayers(unchcekedLayers);
    }
  }, [parentChecked]);

  return (
    <>
      {filteredLayers.map((layer) => (
        <LayerItem
          key={layer.id}
          layer={layer}
          isDisabled={!parentChecked}
          onLayerChange={handleLayerChange}
        />
      ))}
    </>
  );
}
