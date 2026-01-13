/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { GiWindTurbine } from "react-icons/gi";
import { TfiLayoutAccordionList } from "react-icons/tfi";
import { LayerItem } from "../Common/LayerItem";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import WMSLayer from "@arcgis/core/layers/WMSLayer";
import { useHandleLayerChange } from "../helpers/useHandleLayerChange";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

export default function Section4({
  parentChecked,
}: {
  parentChecked: boolean;
}) {
  const [layers, setLayers] = useState([
    {
      id: "8.5",
      title: "Windturbenes",
      checked: false,
      icon: <GiWindTurbine />,
      layer: new MapImageLayer({
        url: "https://geo.rijkswaterstaat.nl/arcgis/rest/services/GDR/windenergiegebieden/MapServer?f=json&dpi=96&transparent=true&format=png8",
        title: "Windturbenes",
      }),
      regio: [],
    },
    {
      id: "8.6",
      title: "Vakken zandwinning",
      checked: false,
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/vakkenzandwinnning/FeatureServer",
        title: "Vakken zandwinning",
      }),
      icon: <div className="w-[80%] h-[2px] bg-yellow-500 rounded-lg" />,
      regio: ["MN"],
    },
    {
      id: "8.7",
      title: "Vegunde vlakken zandwinning",
      checked: false,
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/vergunde_vlakken_zandwinning/FeatureServer",
        title: "Vegunde vlakken zandwinning",
      }),
      icon: (
        <div className="w-[70%] aspect-square bg-yellow-400 border border-black" />
      ),
      regio: ["MN"],
    },
    {
      id: "8.8",
      title: "Luchtvaartgebieden",
      layer: new WMSLayer({
        url: "https://service.pdok.nl/lvnl/drone-no-flyzones/wms/v1_0?request=getCapabilities&service=WMS&version=1.3.0",
        title: "Luchtvaartgebieden",
      }),
      checked: false,
      icon: <TfiLayoutAccordionList className="fill-blue-400" />,
      regio: ["NN", "WNN", "WNZ"],
    },
    {
      id: "8.9",
      title: "Natura2000",
      layer: new WMSLayer({
        url: "https://service.pdok.nl/rvo/natura2000/wms/v1_0?SERVICE=WMS&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=TRUE&STYLES=natura2000%3Alnv_natura2000&VERSION=1.3.0&LAYERS=natura2000&WIDTH=698&HEIGHT=612&CRS=EPSG%3A3857&BBOX=355936.3946125852%2C6695364.19616739%2C569348.5775846944%2C6882482.0414094115",
        title: "Natura2000",
      }),
      checked: false,
      icon: (
        <div className="w-[70%] aspect-square bg-green-200 border border-black" />
      ),
      regio: ["WNN", "WNZ"],
    },
  ]);

  useEffect(() => {
    if (!parentChecked) {
      const unchcekedLayers = layers.map((layer) => ({
        ...layer,
        checked: false,
      }));

      setLayers(unchcekedLayers);
    }
  }, [parentChecked]);

  const handleLayerChange = useHandleLayerChange(setLayers);

  const { user } = useAuth();

  const filteredLayers =
    user.role === "admin"
      ? layers
      : layers.filter((layer) =>
          // @ts-ignore
          layer.regio?.includes(user.role.split(" ")[1])
        );

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
