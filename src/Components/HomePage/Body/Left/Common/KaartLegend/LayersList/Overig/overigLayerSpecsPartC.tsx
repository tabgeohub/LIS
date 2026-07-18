import WMSLayer from "@arcgis/core/layers/WMSLayer";

/** Layer 8.9 */
export const overigLayerSpecsPartC = [
  {
    id: "8.9",
    title: "Natura2000",
    checked: false,
    layer: new WMSLayer({
      url: "https://service.pdok.nl/rvo/natura2000/wms/v1_0?SERVICE=WMS&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=TRUE&STYLES=natura2000%3Alnv_natura2000&VERSION=1.3.0&LAYERS=natura2000&WIDTH=698&HEIGHT=612&CRS=EPSG%3A3857&BBOX=355936.3946125852%2C6695364.19616739%2C569348.5775846944%2C6882482.0414094115",
      title: "Natura2000",
    }),
    icon: (
      <div className="w-[70%] aspect-square bg-green-200 border border-black" />
    ),
    regio: ["WNN", "WNZ"],
  },
];
