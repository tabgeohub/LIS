/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { RiSquareFill } from "react-icons/ri";
import { ParentItem } from "../Common/ParentItem";
import { LayerItem } from "../Common/LayerItem";
import { useHandleLayerChange } from "../helpers/useHandleLayerChange";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

export default function Section1({
  parentChecked,
}: {
  parentChecked: boolean;
}) {
  const { user } = useAuth();

  const [parentChecked1, setParentChecked1] = useState(false);

  const [layers, setLayers] = useState([
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
  ]);

  const sectionRolesUnique = layers
    .map((layer) => layer.regio)
    .flat()
    .filter((value, index, self) => self.indexOf(value) === index);

  const handleLayerChange = useHandleLayerChange(setLayers);

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

  const filteredLayers =
    user.role === "admin"
      ? layers
      : layers.filter((layer) =>
          layer.regio?.includes(user.role.split(" ")[1])
        );

  return (
    <>
      {(user.role === "admin"
        ? true
        : sectionRolesUnique.find((role) => role === user.role)) && (
        <ParentItem
          title="Wegen"
          checked={parentChecked1}
          setChecked={setParentChecked1}
          isDisabled={!parentChecked}
        >
          <div className="pl-8">
            {filteredLayers.map((subLayer) => (
              <LayerItem
                key={subLayer.id}
                layer={subLayer}
                isDisabled={!parentChecked1 || !parentChecked}
                onLayerChange={handleLayerChange}
              />
            ))}
          </div>
        </ParentItem>
      )}
    </>
  );
}
