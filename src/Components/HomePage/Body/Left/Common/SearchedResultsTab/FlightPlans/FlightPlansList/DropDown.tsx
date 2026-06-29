import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { useOpenSearchedTab } from "@helpers/ZustandStates/showSearchedTab";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";

import { FlightPlanType } from "Types";

import { BsFiletypeCsv, BsFiletypeJson, BsFiletypeXlsx } from "react-icons/bs";
import {
  MdAddCircleOutline,
  MdDelete,
  MdDonutLarge,
  MdFolderOpen,
  MdLayers,
  MdOutlineSelectAll,
  MdOutlineZoomOutMap,
  MdSave,
  MdTableChart,
} from "react-icons/md";

import { saveAs } from "file-saver";
import JSZip from "jszip";

import shpwrite from "@mapbox/shp-write";
import { FeatureCollection, Polygon as pl } from "geojson";
import * as XLSX from "@e965/xlsx";

import { useContent } from "hooks/useContent";
import { addPlanStarGraphics } from "hooks/hover-click-handlers/usePlanStarGraphic";

export default function DropDown({
  starredPlans,
  setStarredPlans,
  flightPlansData,
  setFase,
}: {
  starredPlans: FlightPlanType[];
  setStarredPlans: (value: FlightPlanType[]) => void;
  flightPlansData: FlightPlanType[];
  setFase: (value: string) => void;
}) {
  const { redGraphicsLayer } = useMapViewState();

  const { setPointsTable, setOpenTable, setFlightPlans, setView } =
    useOpenTable();

  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { setSelectedTab } = useTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { setOpenSearchedTab } = useOpenSearchedTab();

  const tableView = () => {
    setOpenTable(true);
    setPointsTable([]);
    setView("points");
    setFlightPlans(flightPlansData);
    setSelectedBottomTab("topTabs");
    setSelectedTab("none");
    setOpenSearchedTab(false);
    setOpenSideBar(false);
  };

  const func = () => {};

  const selectAll = () => {
    if (!redGraphicsLayer) return;

    const newStars = flightPlansData.filter(
      (point) => !starredPlans.some((p) => p.id === point.id)
    );

    const combined = [...starredPlans, ...newStars];
    const unique = Array.from(new Map(combined.map((p) => [p.id, p])).values());
    setStarredPlans(unique);

    addPlanStarGraphics(newStars, redGraphicsLayer, "search");
  };

  const exportCsv = async () => {
    const plans = flightPlansData as FlightPlanType[];

    const headersPlans = Object.keys(plans[0]).filter(
      (key) => key !== "points"
    );

    const csvPlans = [
      headersPlans.join(","),
      ...plans.map((p) =>
        headersPlans
          .map((h) => `"${p[h as keyof FlightPlanType] ?? ""}"`)
          .join(",")
      ),
    ].join("\n");

    const blobPlans = new Blob([csvPlans], { type: "text/csv;charset=utf-8;" });
    saveAs(blobPlans, "plans_export.csv");
  };

  const exportXlsx = async () => {
    const plans = flightPlansData as FlightPlanType[];

    const cleanedPlans = plans.map(({ points, ...rest }) => rest);
    const wsPlans = XLSX.utils.json_to_sheet(cleanedPlans);
    const wbPlans = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wbPlans, wsPlans, "FlightPlans");
    const plansBuffer = XLSX.write(wbPlans, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([plansBuffer], { type: "application/octet-stream" });

    saveAs(blob, "exports_xlsx.xlsx");
  };

  function getBboxPolygon(coords: [number, number][]): pl {
    const lons = coords.map((c) => c[0]);
    const lats = coords.map((c) => c[1]);

    const minX = Math.min(...lons);
    const maxX = Math.max(...lons);
    const minY = Math.min(...lats);
    const maxY = Math.max(...lats);

    const polygon: pl = {
      type: "Polygon",
      coordinates: [
        [
          [minX, minY],
          [maxX, minY],
          [maxX, maxY],
          [minX, maxY],
          [minX, minY],
        ],
      ],
    };

    return polygon;
  }

  const exportShp = async () => {
    const zip = new JSZip();
    const plans = flightPlansData as FlightPlanType[];

    const geojsonPlans: FeatureCollection<pl> = {
      type: "FeatureCollection",
      features: plans.map((plan) => {
        const coords: [number, number][] = plan.points.map((pt) => [
          pt.longitude,
          pt.latitude,
        ]);

        const polygon = getBboxPolygon(coords);

        return {
          type: "Feature",
          geometry: polygon,
          properties: {
            id: plan.id,
            name: plan.vluchtnummer,
            date: plan.datum,
          },
        };
      }),
    };

    const plansZip = shpwrite.zip(geojsonPlans, {
      compression: "DEFLATE",
      outputType: "blob",
    });

    zip.file("plans.zip", plansZip);

    const finalZipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(finalZipBlob, "exports_shapefiles.zip");
  };

  const content = useContent();

  return (
    <div className="absolute top-[100%] right-0 z-10 bg-white rounded-md shadow-md w-[350px] max-h-[330px] overflow-y-auto border border-gray-300 thin-scrollbar">
      <MenuItem
        icon={<MdAddCircleOutline className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.addPoints.title}
        onClick={func}
        description={
          content.layout.searchResult.listPointFunctions.addPoints.subtitle
        }
      />

      <MenuItem
        icon={<MdTableChart className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.tableView.title}
        onClick={tableView}
        description={
          content.layout.searchResult.listPointFunctions.tableView.subtitle
        }
      />

      <MenuItem
        icon={<MdOutlineZoomOutMap className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.zoomAll.title}
        onClick={func}
        description={
          content.layout.searchResult.listPointFunctions.zoomAll.subtitle
        }
      />

      <MenuItem
        icon={<MdOutlineSelectAll className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.selectAll.title}
        onClick={selectAll}
        description={
          content.layout.searchResult.listPointFunctions.selectAll.subtitle
        }
      />

      <MenuItem
        icon={<MdDonutLarge className="text-2xl text-primary mt-1" />}
        title={
          content.layout.searchResult.listPointFunctions.bufferOptions.title
        }
        onClick={() => setFase("buffer")}
        description={
          content.layout.searchResult.listPointFunctions.bufferOptions.subtitle
        }
      />

      <MenuItem
        icon={<BsFiletypeCsv className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.exportCsv.title}
        onClick={exportCsv}
        description={
          content.layout.searchResult.listPointFunctions.exportCsv.subtitle
        }
      />

      <MenuItem
        icon={<BsFiletypeXlsx className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.exportXlsx.title}
        onClick={exportXlsx}
        description={
          content.layout.searchResult.listPointFunctions.exportXlsx.subtitle
        }
      />

      <MenuItem
        icon={<BsFiletypeJson className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.exportShp.title}
        onClick={exportShp}
        description={
          content.layout.searchResult.listPointFunctions.exportShp.subtitle
        }
      />

      <MenuItem
        icon={<MdFolderOpen className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.openSaved.title}
        onClick={func}
        description={
          content.layout.searchResult.listPointFunctions.openSaved.subtitle
        }
      />

      <MenuItem
        icon={<MdSave className="text-2xl text-primary mt-1" />}
        title={content.layout.searchResult.listPointFunctions.saveResults.title}
        onClick={func}
        description={
          content.layout.searchResult.listPointFunctions.saveResults.subtitle
        }
      />

      <MenuItem
        icon={<MdLayers className="text-2xl text-primary mt-1" />}
        title={
          content.layout.searchResult.listPointFunctions.combineResults.title
        }
        onClick={func}
        description={
          content.layout.searchResult.listPointFunctions.combineResults.subtitle
        }
      />

      <MenuItem
        icon={<MdDelete className="text-2xl text-primary mt-1" />}
        title={
          content.layout.searchResult.listPointFunctions.removeFromResults.title
        }
        onClick={func}
        description={
          content.layout.searchResult.listPointFunctions.removeFromResults
            .subtitle
        }
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
