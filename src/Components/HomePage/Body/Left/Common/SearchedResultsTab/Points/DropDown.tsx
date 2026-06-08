import { starAllPointsOnMap } from "@helpers/ArcGISHelpers/createPointMapGraphics";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import {
  MdAddCircleOutline,
  MdTableChart,
  MdOutlineZoomOutMap,
  MdOutlineSelectAll,
  MdDonutLarge,
  MdFolderOpen,
  MdSave,
  MdLayers,
  MdDelete,
} from "react-icons/md";
import { saveAs } from "file-saver";
import { EnrichedPointType } from "Types";
import * as XLSX from "xlsx";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { useOpenSearchedTab } from "@helpers/ZustandStates/showSearchedTab";
import { BsFiletypeCsv, BsFiletypeJson, BsFiletypeXlsx } from "react-icons/bs";
import shpwrite from "@mapbox/shp-write";

import { FeatureCollection, Point as pt, Feature } from "geojson";
import { useContent } from "hooks/useContent";
export default function DropDown({
  starredPoints,
  setStarredPoints,
  setOpenListPointDiv,
  pointsData,
  setFase,
}: {
  starredPoints: EnrichedPointType[];
  setStarredPoints: (value: EnrichedPointType[]) => void;
  setOpenListPointDiv: (value: boolean) => void;
  pointsData: EnrichedPointType[];
  setFase: (value: string) => void;
}) {
  const { graphicsLayer } = useMapViewState();

  const { setPointsTable, setView, setOpenTable } = useOpenTable();

  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { setSelectedTab } = useTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { setOpenSearchedTab } = useOpenSearchedTab();

  const tableView = () => {
    setOpenTable(true);
    setPointsTable(pointsData);
    setSelectedBottomTab("topTabs");
    setSelectedTab("none");
    setView("points");

    setOpenSearchedTab(false);
    setOpenSideBar(false);
  };

  const selectAll = () => {
    setOpenListPointDiv(false);
    starAllPointsOnMap({
      points: pointsData,
      starredPoints,
      setStarredPoints,
      graphicsLayer,
    });
  };

  const func = () => {};

  const exportCsv = async () => {
    const plans = pointsData as EnrichedPointType[];

    const headersPlans = Object.keys(plans[0]).filter(
      (key) => key !== "points"
    );

    const csvPlans = [
      headersPlans.join(","),
      ...plans.map((p) =>
        headersPlans
          .map((h) => `"${p[h as keyof EnrichedPointType] ?? ""}"`)
          .join(",")
      ),
    ].join("\n");

    const blobPlans = new Blob([csvPlans], { type: "text/csv;charset=utf-8;" });
    saveAs(blobPlans, "plans_export.csv");
  };

  const exportXlsx = async () => {
    const plans = pointsData as EnrichedPointType[];

    const wsPlans = XLSX.utils.json_to_sheet(plans);
    const wbPlans = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wbPlans, wsPlans, "FlightPlans");
    const plansBuffer = XLSX.write(wbPlans, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([plansBuffer], { type: "application/octet-stream" });

    saveAs(blob, "exports_xlsx.xlsx");
  };

  const exportShp = async () => {
    const plans = pointsData as EnrichedPointType[];

    const geojsonPlans: FeatureCollection<pt> = {
      type: "FeatureCollection",
      features: plans.map((point) => {
        const feature: Feature<pt> = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [point.longitude, point.latitude],
          },
          properties: { ...point },
        };
        return feature;
      }),
    };

    shpwrite.download(geojsonPlans, {
      compression: "DEFLATE",
      outputType: "blob",
    });
  };

  const content = useContent();

  return (
    <div className="absolute top-[100%] right-0 z-10 bg-white rounded-md shadow-md w-[350px] max-h-[330px] overflow-y-auto border border-gray-300 thin-scrollbar">
      <MenuItem
        icon={<MdAddCircleOutline className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.addPoints.title}
        description={
          content.layout.searchResult.listPointFunctions.addPoints.subtitle
        }
        onClick={() => setFase("addPoint")}
      />

      <MenuItem
        icon={<MdTableChart className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.tableView.title}
        description={
          content.layout.searchResult.listPointFunctions.tableView.subtitle
        }
        onClick={tableView}
      />

      <MenuItem
        icon={<MdOutlineZoomOutMap className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.zoomAll.title}
        description={
          content.layout.searchResult.listPointFunctions.zoomAll.subtitle
        }
        onClick={func}
      />

      <MenuItem
        icon={<MdOutlineSelectAll className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.selectAll.title}
        description={
          content.layout.searchResult.listPointFunctions.selectAll.subtitle
        }
        onClick={selectAll}
      />

      <MenuItem
        icon={<MdDonutLarge className="text-2xl text-primary mt-1" />}
        title={
          content.layout.searchResult.listPointFunctions.bufferOptions.title
        }
        description={
          content.layout.searchResult.listPointFunctions.bufferOptions.subtitle
        }
        onClick={() => setFase("buffer")}
      />

      <MenuItem
        icon={<BsFiletypeCsv className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.exportCsv.title}
        description={
          content.layout.searchResult.listPointFunctions.exportCsv.subtitle
        }
        onClick={exportCsv}
      />

      <MenuItem
        icon={<BsFiletypeXlsx className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.exportXlsx.title}
        description={
          content.layout.searchResult.listPointFunctions.exportXlsx.subtitle
        }
        onClick={exportXlsx}
      />

      <MenuItem
        icon={<BsFiletypeJson className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.exportShp.title}
        description={
          content.layout.searchResult.listPointFunctions.exportShp.subtitle
        }
        onClick={exportShp}
      />

      <MenuItem
        icon={<MdFolderOpen className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.openSaved.title}
        description={
          content.layout.searchResult.listPointFunctions.openSaved.subtitle
        }
        onClick={func}
      />

      <MenuItem
        icon={<MdSave className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.saveResults.title}
        description={
          content.layout.searchResult.listPointFunctions.saveResults.subtitle
        }
        onClick={func}
      />

      <MenuItem
        icon={<MdLayers className="text-2xl text-primary mt-1" />}
        title={
          content.layout.searchResult.listPointFunctions.combineResults.title
        }
        description={
          content.layout.searchResult.listPointFunctions.combineResults.subtitle
        }
        onClick={func}
      />

      <MenuItem
        icon={<MdDelete className="text-2xl text-primary mt-1" />}
        title={
          content.layout.searchResult.listPointFunctions.removeFromResults.title
        }
        description={
          content.layout.searchResult.listPointFunctions.removeFromResults
            .subtitle
        }
        onClick={func}
      />
    </div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function MenuItem({ icon, title, description, onClick }: MenuItemProps) {
  return (
    <div
      className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b"
      onClick={onClick}
    >
      <div>{icon}</div>

      <div>
        <p className="text-[14px] font-semibold text-gray-800">{title}</p>
        <p className="text-[12px] text-gray-500">{description}</p>
      </div>
    </div>
  );
}
