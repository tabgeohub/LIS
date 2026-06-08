import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import LegendSection from "../Common/LegendSection";

const ALL_REGIOS = ["ZD", "NN", "WNN", "MN", "WNZ", "ON", "ZN"];

export default function Section1() {
  const { pointsGraphicsLayer, geometriesGraphicsLayer } = useMapViewState();

  return (
    <LegendSection
      initialLayers={[
        {
          id: "1",
          title: "Aandachtspunten",
          layer: pointsGraphicsLayer,
          checked: true,
          regio: ALL_REGIOS,
        },
        {
          id: "2",
          title: "Geometries",
          layer: geometriesGraphicsLayer,
          checked: true,
          regio: ALL_REGIOS,
        },
      ]}
    />
  );
}
