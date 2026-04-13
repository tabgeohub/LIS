import { useState } from "react";
import { useHandleLayerChange } from "../helpers/useHandleLayerChange";
import { LayerItem } from "../Common/LayerItem";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useAuth } from "@helpers/ZustandStates/useAuth";

export default function Section1() {
  const { pointsGraphicsLayer, geometriesGraphicsLayer } = useMapViewState();

  const [layers, setLayers] = useState([
    {
      id: "1",
      title: "Aandachtspunten",
      layer: pointsGraphicsLayer,
      checked: true,
      regio: ["ZD", "NN", "WNN", "MN", "WNZ", "ON", "ZN"],
    },
    {
      id: "2",
      title: "Geometries",
      layer: geometriesGraphicsLayer,
      checked: true,
      regio: ["ZD", "NN", "WNN", "MN", "WNZ", "ON", "ZN"],
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
      {filteredLayers.map((sublayer) => (
        <LayerItem
          key={sublayer.id}
          layer={sublayer}
          onLayerChange={handleLayerChange}
        />
      ))}
    </>
  );
}
