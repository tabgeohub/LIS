/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { GiPylon } from "react-icons/gi";
import { ParentItem } from "../Common/ParentItem";
import { LayerItem } from "../Common/LayerItem";
import { useHandleLayerChange } from "../helpers/useHandleLayerChange";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

export default function Section3({
  parentChecked,
}: {
  parentChecked: boolean;
}) {
  const [parentChecked1, setParentChecked1] = useState(false);
  const { user } = useAuth();

  const [layers, setLayers] = useState([
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
  ]);

  const sectionRolesUnique = layers
    .map((layer) => layer.regio)
    .flat()
    .filter((value, index, self) => self.indexOf(value) === index);

  const handleLayerChange = useHandleLayerChange(setLayers);

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

      setParentChecked1(false);

      setLayers(unchcekedLayers);
    }
  }, [parentChecked]);

  useEffect(() => {
    if (!parentChecked1) {
      const unchcekedLayers = layers.map((layer) => ({
        ...layer,
        checked: false,
      }));

      setLayers(unchcekedLayers);
    }
  }, [parentChecked1]);

  return (
    <>
      {(user.role === "admin"
        ? true
        : sectionRolesUnique.find((role) => role === user.role)) && (
        <ParentItem
          title="Hoogspanningsmasten"
          checked={parentChecked1}
          setChecked={setParentChecked1}
          isDisabled={!parentChecked}
        >
          <div className="pl-8">
            {filteredLayers.map((layer) => (
              <LayerItem
                key={layer.id}
                layer={layer}
                isDisabled={!parentChecked || !parentChecked1}
                onLayerChange={handleLayerChange}
              />
            ))}
          </div>
        </ParentItem>
      )}
    </>
  );
}
