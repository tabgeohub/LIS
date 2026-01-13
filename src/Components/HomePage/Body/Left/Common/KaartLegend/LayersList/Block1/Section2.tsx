/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { IoTriangle } from "react-icons/io5";
import { LayerItem } from "../Common/LayerItem";
import { ParentItem } from "../Common/ParentItem";
import { useHandleLayerChange } from "../helpers/useHandleLayerChange";
import { useAuth } from "@helpers/ZustandStates/useAuth";

export default function Section2() {
  const [parentChecked, setParentChecked] = useState(false);

  const [layers, setLayers] = useState([
    {
      id: "3.1",
      title: "Waypoints",
      layer: null,
      checked: false,
      icon: <IoTriangle className="fill-blue-900 size-3" />,
      regio: [],
    },
    {
      id: "3.2",
      title: "Tracks",
      layer: null,
      checked: false,
      icon: <div className="bg-green-400 w-[80%] h-[2px] rounded-lg" />,
      // regio: [],
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
    <ParentItem
      title="Waypoints en tracks"
      checked={parentChecked}
      setChecked={setParentChecked}
    >
      <div className="pl-8">
        {filteredLayers.map((layer) => (
          <LayerItem
            key={layer.id}
            layer={layer}
            onLayerChange={handleLayerChange}
            isDisabled={!parentChecked}
          />
        ))}
      </div>
    </ParentItem>
  );
}
