import { useMemo, useEffect } from "react";
import Basemap from "@arcgis/core/Basemap";
import WMTSLayer from "@arcgis/core/layers/WMTSLayer";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { BasemapsType } from "Types";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useSelectedBasemapState } from "hooks/kaartlagen/useBasemapStore";
import { classNames } from "@helpers/classNames";

type UsedPlace = "Map" | "Kaartlagen";

export default function BasemapsList({
  usedPlace = "Kaartlagen",
}: {
  usedPlace?: UsedPlace;
}) {
  const {
    setSelectedBasemap,
    ondergrond,
    setOndergrond,
    basemap,
    setBasemap,
    openCheck,
    setOpenCheck,
  } = useSelectedBasemapState();

  const { mapView } = useMapViewState();

  const basemaps = useMemo(() => {
    const wmts = new Basemap({
      baseLayers: [
        new WMTSLayer({
          url: "https://api.ellipsis-drive.com/v3/ogc/wmts/28fb0f5f-e367-4265-b84b-1b8f1a8a6409?request=getCapabilities&requestedEpsg=28992",
        }),
      ],
      title: "Open Topo",
      id: "open-topo",
    });

    return {
      "topo-vector": "topo-vector" as const,
      luchtfoto: "hybrid" as const,
      "open-topo": wmts,
    };
  }, []);

  // Thumbnails from /public/basemaps/
  const thumbnails: Record<BasemapsType, string> = {
    "topo-vector": "/basemaps/topo-vector.png",
    luchtfoto: "/basemaps/luchtfoto.png",
    "open-topo": "/basemaps/open-topo.png",
  };

  const applyBasemap = (id: BasemapsType) => {
    if (!mapView) return;
    const bm = basemaps[id];
    mapView.map.basemap = bm;
    setSelectedBasemap(id);
  };

  const handleChangeBasemap = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.dataset.id as BasemapsType;
    if (!selected) return;
    setBasemap(selected);
    applyBasemap(selected);
  };

  useEffect(() => {
    if (!mapView) return;
    mapView.map.basemap?.baseLayers.forEach((lyr) => {
      lyr.visible = ondergrond;
    });
  }, [ondergrond, mapView, basemap]);

  const options: Array<{ id: BasemapsType; label: string }> = [
    { id: "topo-vector", label: "Topo Vector" },
    { id: "luchtfoto", label: "Luchtfoto" },
    { id: "open-topo", label: "Open Topo" },
  ];

  const showList = () => {
    if (openCheck) return true;

    if (!openCheck) {
      if (usedPlace === "Map") {
        return true;
      }

      if (usedPlace === "Kaartlagen") {
        return false;
      }
    }
  };

  return (
    <div>
      {usedPlace === "Kaartlagen" && (
        <div className="flex items-center justify-between px-3 py-1 hover:bg-gray-100">
          <div
            className="flex items-center gap-2 w-full cursor-pointer"
            onClick={() => setOpenCheck(!openCheck)}
          >
            <span className="text-gray-500 w-4">
              {openCheck ? <FaMinus /> : <FaPlus />}
            </span>

            <input
              id="ondergrond"
              checked={ondergrond}
              onChange={(e) => {
                e.stopPropagation();
                setOndergrond(e.target.checked);
              }}
              type="checkbox"
              className="h-[12px] w-[12px] cursor-pointer"
            />
            <label htmlFor="ondergrond" className="cursor-pointer select-none">
              Ondergrond
            </label>
          </div>
          <div className="text-gray-400 text-sm">
            <div className="w-2 h-2 border-r border-b border-gray-400 rotate-45 mr-1 mt-0.5" />
          </div>
        </div>
      )}

      {showList() && (
        <div className="space-y-1 pl-4 mt-3">
          {options.map((item) => (
            <div
              key={item.id}
              className={classNames(
                "flex items-center px-3 py-1 hover:bg-gray-100",
                usedPlace === "Kaartlagen" && "pl-14"
              )}
            >
              {usedPlace === "Map" && (
                <img
                  src={thumbnails[item.id]}
                  alt={`${item.label} preview`}
                  className="h-6 w-6 rounded border mr-2 shrink-0 object-cover"
                  draggable={false}
                />
              )}

              <input
                id={item.id}
                data-id={item.id}
                type="radio"
                name="basemap"
                checked={basemap === item.id}
                disabled={!ondergrond}
                onChange={handleChangeBasemap}
                className="h-[12px] w-[12px] cursor-pointer"
              />

              <label
                htmlFor={item.id}
                className="ml-2 cursor-pointer select-none"
              >
                {item.label}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
