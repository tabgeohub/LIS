import { IoTriangle } from "react-icons/io5";
import LegendSection from "../Common/LegendSection";

export default function Section2() {
  return (
    <LegendSection
      parentTitle="Waypoints en tracks"
      initialLayers={[
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
          regio: ["ON"],
        },
      ]}
    />
  );
}
