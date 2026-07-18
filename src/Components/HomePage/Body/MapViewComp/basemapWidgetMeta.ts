export const BASEMAP_THUMBNAILS: Record<
  "topo-vector" | "luchtfoto" | "open-topo",
  string
> = {
  "topo-vector": "/basemaps/topo-vector.png",
  luchtfoto: "/basemaps/luchtfoto.png",
  "open-topo": "/basemaps/open-topo.png",
};

export const BASEMAP_LABELS: Record<keyof typeof BASEMAP_THUMBNAILS, string> = {
  "topo-vector": "Topo Vector",
  luchtfoto: "Luchtfoto",
  "open-topo": "Open Topo",
};
