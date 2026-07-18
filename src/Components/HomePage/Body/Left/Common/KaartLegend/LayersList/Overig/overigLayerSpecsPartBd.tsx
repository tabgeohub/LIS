import WMSLayer from "@arcgis/core/layers/WMSLayer";
import { TfiLayoutAccordionList } from "react-icons/tfi";

/** Layer 8.8 */
export const overigLayerSpecsPartBd = [
  {
    id: "8.8",
    title: "Luchtvaartgebieden",
    checked: false,
    layer: new WMSLayer({
      url: "https://service.pdok.nl/lvnl/drone-no-flyzones/wms/v1_0?request=getCapabilities&service=WMS&version=1.3.0",
      title: "Luchtvaartgebieden",
    }),
    icon: <TfiLayoutAccordionList className="fill-blue-400" />,
    regio: ["NN", "WNN", "WNZ"],
  },
];
