/* eslint-disable react-hooks/exhaustive-deps */
import { TfiLayoutAccordionList } from "react-icons/tfi";
import { ParentItem } from "../Common/ParentItem";
import { BsFillPentagonFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import { IoTriangleSharp } from "react-icons/io5";
import { LayerItem } from "../Common/LayerItem";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import { useHandleLayerChange } from "../helpers/useHandleLayerChange";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { kaartlagenState } from "hooks/kaartlagen/kaartlagenState";

export default function NNederland() {
  const { user } = useAuth();
  const { selectedLayers } = kaartlagenState();

  const [parentChecked, setParentChecked] = useState(false);

  const [layers, setLayers] = useState([
    {
      id: "9.1",
      title: "Betonning Totaal",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Betonning_Totaal/FeatureServer",
        title: "Betonning Totaal",
      }),
      checked: false,
      icon: <TfiLayoutAccordionList className="fill-blue-400" />,
      regio: ["NN", "MN"],
    },
    {
      id: "9.2",
      title: "ARZ",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/ARZ/FeatureServer",
        title: "ARZ",
      }),
      checked: false,
      icon: <div className="w-[70%] h-[5px] bg-red-500 border" />,
    },
    {
      id: "9.3",
      title: "Strandpaviljoens",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Strandpaviljoens/FeatureServer",
        title: "Strandpaviljoens",
      }),
      checked: false,
      icon: (
        <div className="relative">
          <BsFillPentagonFill className="fill-orange-400" />

          <div className="h-[3px] aspect-square bg-black absolute top-[48%] left-[50%] translate-x-[-50%]" />
        </div>
      ),
      regio: ["NN"],
    },
    {
      id: "9.4",
      title: "Strandpalen",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Strandpalen/FeatureServer",
        title: "Strandpalen",
      }),
      checked: false,
      icon: (
        <div className="relative">
          <div className="h-[12px] aspect-square bg-orange-500 rounded-full border border-orange-600" />

          <div className="h-[2px] aspect-square bg-black absolute top-[48%] left-[50%] translate-x-[-50%]" />
        </div>
      ),
      regio: ["NN"],
    },
    {
      id: "9.5",
      title: "Damnummers",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Damnummers/FeatureServer",
        title: "Damnummers",
      }),
      checked: false,
      icon: (
        <div className="w-[6px] aspect-square border-2 border-black bg-orange-600 rotate-45" />
      ),
      regio: ["NN"],
    },
    {
      id: "9.6",
      title: "Lozingspunten",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Lozingspunten/FeatureServer",
        title: "Lozingspunten",
      }),
      checked: false,
      icon: (
        <div className="relative">
          <IoTriangleSharp className="fill-green-400" />

          <div className="h-[2px] aspect-square bg-black absolute top-[48%] left-[50%] translate-x-[-50%] translate-y-[50%] rounded-full" />
        </div>
      ),
      regio: ["NN"],
    },
    {
      id: "9.7",
      title: "Vloestofleidingen",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Vloeistofleidingen/FeatureServer",
        title: "Vloestofleidingen",
      }),
      checked: false,
      icon: <div className="w-[80%] h-[2px] bg-blue-800" />,
      regio: ["NN"],
    },
    {
      id: "9.8",
      title: "DataTelecom",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/DataTelecom/FeatureServer",
        title: "DataTelecom",
      }),
      checked: false,
      icon: <div className="w-[80%] h-[2px] bg-green-400" />,
      regio: ["NN"],
    },
    {
      id: "9.9",
      title: "Electrkabels",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Electrkabels/FeatureServer",
        title: "Electrkabels",
      }),
      checked: false,
      icon: <div className="w-[80%] h-[2px] bg-red-500" />,
      regio: ["NN"],
    },
    {
      id: "9.10",
      title: "Gasleidingen",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Gasleidingen/FeatureServer",
        title: "Gasleidingen",
      }),
      checked: false,
      icon: <div className="w-[80%] h-[2px] bg-orange-500" />,
      regio: ["NN"],
    },
    {
      id: "9.11",
      title: "Primaire_keringen",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Primaire_keringen/FeatureServer",
        title: "Primaire_keringen",
      }),
      checked: false,
      icon: <div className="w-[80%] h-[7px] bg-green-500" />,
      regio: ["NN", "MN"],
    },
    {
      id: "9.12",
      title: "Vaarwegen",
      layer: new MapImageLayer({
        url: "https://geo.rijkswaterstaat.nl/arcgis/rest/services/GDR/nwb_wegen/MapServer/2",
        title: "Vaarwegen",
      }),
      checked: false,
      icon: <div className="w-[80%] h-[2px] bg-blue-700" />,
      regio: ["NN", "MN"],
    },
    {
      id: "9.13",
      title: "Snelvaren",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Snelvaren/FeatureServer",
        title: "Snelvaren",
      }),
      checked: false,
      icon: <div className="w-[80%] h-[2px] bg-blue-200" />,
      regio: ["NN", "MN"],
    },
    {
      id: "9.14",
      title: "Strandovergangen",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Strandovergangen/FeatureServer",
        title: "Strandovergangen",
      }),
      checked: false,
      icon: <div className="w-[80%] h-[6px] bg-yellow-200" />,
      regio: ["NN"],
    },
    {
      id: "9.15",
      title: "Wadlooproutes",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Wadlooproutes/FeatureServer",
        title: "Wadlooproutes",
      }),
      checked: false,
      icon: <div className="w-[80%] h-[8px] bg-green-200" />,
      regio: ["NN"],
    },
    {
      id: "9.16",
      title: "Tycomkabel",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Tycomkabel/FeatureServer",
        title: "Tycomkabel",
      }),
      checked: false,
      icon: <div className="w-[80%] h-[2px] bg-green-400" />,
      regio: ["NN"],
    },
    {
      id: "9.17",
      title: "NGTleiding",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/NGTleiding/FeatureServer",
        title: "NGTleiding",
      }),
      checked: false,
      icon: <div className="w-[80%] h-[2px] bg-orange-400" />,
      regio: ["NN"],
    },
    {
      id: "9.18",
      title: "NorNedkabel",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/NorNedkabel/FeatureServer",
        title: "NorNedkabel",
      }),
      checked: false,
      icon: <div className="w-[80%] h-[2px] bg-red-500" />,
      regio: ["NN"],
    },
    {
      id: "9.19",
      title: "Kwelderdammen",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Kwelderdammen/FeatureServer",
        title: "Kwelderdammen",
      }),
      checked: false,
      icon: (
        <div className="relative w-full flex items-center justify-center">
          <div className="w-[80%] h-[2px] bg-orange-500" />

          <div className="h-[8px] w-[2px] bg-gray-700 absolute right-1.5" />
        </div>
      ),
      regio: ["NN"],
    },
    {
      id: "9.20",
      title: "Eemsverdrag",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Eemsverdrag/FeatureServer",
        title: "Eemsverdrag",
      }),
      checked: false,
      icon: (
        <div className="w-[80%] aspect-square border-2 border-dashed border-red-500" />
      ),
      regio: ["NN"],
    },
    {
      id: "9.21",
      title: "Pierenwinning",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Pierenwinning/FeatureServer",
        title: "Pierenwinning",
      }),
      checked: false,
      icon: (
        <div className="w-[80%] aspect-square border-[1.5px] border-black bg-pink-200" />
      ),
      regio: ["NN"],
    },
    {
      id: "9.22",
      title: "MZI_installaties2018",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/MZI_installaties2018/FeatureServer",
        title: "MZI_installaties2018",
      }),
      checked: false,
      icon: (
        <div className="w-[80%] aspect-square border-[1px] border-black bg-orange-200" />
      ),
      regio: ["NN"],
    },
    {
      id: "9.23",
      title: "MZI_locaties",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/MZI_locaties2018/FeatureServer",
        title: "MZI_locaties",
      }),
      checked: false,
      icon: (
        <div className="w-[80%] aspect-square border-[1.5px] border-black bg-purple-200" />
      ),
      regio: ["NN"],
    },
    {
      id: "9.24",
      title: "Mosselpercelen",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Mosselpercelen/FeatureServer",
        title: "Mosselpercelen",
      }),
      checked: false,
      icon: (
        <div className="w-[80%] aspect-square border-[1px] border-black bg-blue-200" />
      ),
      regio: ["NN"],
    },
    {
      id: "9.25",
      title: "Schelpenwinning",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Schelpenwinning/FeatureServer",
        title: "Schelpenwinning",
      }),
      checked: false,
      icon: (
        <div className="w-[80%] aspect-square border-[1.5px] border-black bg-pink-200" />
      ),
      regio: ["NN"],
    },
    {
      id: "9.26",
      title: "Bruggen_Sluizen_HLD",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Bruggen_Sluizen_HLD/FeatureServer",
        title: "Bruggen_Sluizen_HLD",
      }),
      checked: false,
      icon: (
        <div className="relative w-full flex items-center justify-center">
          <div className="w-[80%] aspect-square bg-green-400" />

          <div className="h-[4px] aspect-square bg-black absolute left-[50%] -translate-x-[50%] -translate-y-[50%] top-[50%] rounded-full" />
        </div>
      ),
      regio: ["NN"],
    },
    {
      id: "9.27",
      title: "BeheersgrensHLD",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/BeheersgrensHLD/FeatureServer",
        title: "BeheersgrensHLD",
      }),
      checked: false,
      icon: (
        <div className="w-[80%] aspect-square border-[1px] border-black bg-purple-500" />
      ),
      regio: ["NN"],
    },
    {
      id: "9.28",
      title: "Waterregeling",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Waterregeling/FeatureServer",
        title: "Waterregeling",
      }),
      checked: false,
      icon: (
        <div className="w-[80%] aspect-square border-[1px] border-black bg-yellow-200" />
      ),
      regio: ["NN"],
    },
    {
      id: "9.29",
      title: "Paviljoens",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Paviljoens/FeatureServer",
        title: "Paviljoens",
      }),
      checked: false,
      icon: (
        <div className="w-[80%] aspect-square border-[1px] border-black bg-orange-500" />
      ),
      regio: ["NN"],
    },
    {
      id: "9.30",
      title: "Verspreidingsvakken",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Verspreidingsvakken/FeatureServer",
        title: "Verspreidingsvakken",
      }),
      checked: false,
      icon: (
        <div className="w-[80%] aspect-square border-[1.5px] border-black bg-green-200/50" />
      ),
      regio: ["NN"],
    },
    {
      id: "9.31",
      title: "Kitesurfgebieden",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Kitesurfgebieden/FeatureServer",
        title: "Kitesurfgebieden",
      }),
      checked: false,
      icon: (
        <div className="w-[80%] aspect-square border-[1.5px] border-black bg-purple-200" />
      ),
      regio: ["NN", "MN"],
    },
    {
      id: "9.32",
      title: "Artikel20_2017",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Artikel20_2017/FeatureServer",
        title: "Artikel20_2017",
      }),
      checked: false,
      icon: (
        <div className="w-[80%] aspect-square border-[1.5px] border-black bg-green-400" />
      ),
      regio: ["NN"],
    },
    {
      id: "9.33",
      title: "Natura2000_NN",
      layer: new FeatureLayer({
        url: "https://services-eu1.arcgis.com/4D1GBrbE6xp1T4YG/arcgis/rest/services/Natura2000_NN/FeatureServer",
        title: "Natura2000_NN",
      }),
      checked: false,
      icon: (
        <div className="w-[80%] aspect-square border-[1px] border-black bg-lime-600" />
      ),
      regio: ["NN"],
    },
  ]);

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
      setLayers(unchcekedLayers);
    }
  }, [parentChecked]);

  useEffect(() => {
    if (selectedLayers.length > 0) {
      setParentChecked(true);

      setLayers(
        layers.map((layer) => ({
          ...layer,
          checked: selectedLayers.includes(layer.id),
        }))
      );
    }
  }, [selectedLayers]);

  return (
    <>
      {filteredLayers.length > 0 && (
        <ParentItem
          title="NNederland"
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
      )}
    </>
  );
}
