import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useOpenResultTab } from "@helpers/ZustandStates/showResultTab";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { FaListAlt, FaSave } from "react-icons/fa";
import { ImTable2 } from "react-icons/im";
import { IoMdAdd } from "react-icons/io";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { EnrichedPointType } from "Types";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import { PiSelectionForegroundThin } from "react-icons/pi";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { BsFiletypeCsv, BsFiletypeJson, BsFiletypeXlsx } from "react-icons/bs";
import { FaFolderOpen } from "react-icons/fa6";
import { TbBorderOuter, TbLayersLinked } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import shpwrite from "@mapbox/shp-write";
import { FeatureCollection, Point as pt, Feature } from "geojson";
import { useViewPlanState } from "../../../Voorbereiding/ViewPlan/helpers/useViewPlanState";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function ListPointFunctions({
  starredPoints,
  setStarredPoints,
  setOpenListPointDiv,
  setFase,
}: {
  starredPoints: EnrichedPointType[];
  setStarredPoints: (value: EnrichedPointType[]) => void;
  setOpenListPointDiv: (value: boolean) => void;
  setFase: (value: string) => void;
}) {
  const logAction = useLogAction();

  const { pointsTable, setOpenTable, setView } = useOpenTable();

  const { setOpenResultTab } = useOpenResultTab();

  const { setSelectedBottomTab } = useSelectedBottomTabState();

  const { setStep } = useViewPlanState();

  const { setSelectedTab } = useTabState();

  const { graphicsLayer } = useMapViewState();

  const tableView = () => {
    setOpenResultTab(false);
    setView("points");
    setSelectedBottomTab("topTabs");
    setSelectedTab("viewPlan");
    setOpenTable(true);

    logAction({
      message: "User changed view to 'Points' in the 'ResultTab' component",
      step: "ResultTab",
    });
  };

  const addPoint = () => {
    setStep(4);
    setSelectedBottomTab("topTabs");
    setSelectedTab("viewPlan");

    setOpenResultTab(false);

    logAction({
      message: "User changed view to 'Points' in the 'ResultTab' component",
      step: "ResultTab",
    });
  };

  const selectAll = () => {
    setOpenListPointDiv(false);
    if (!graphicsLayer) return;

    const newStars = pointsTable.filter(
      (point) => !starredPoints.some((p) => p.id === point.id)
    );

    const combined = [...starredPoints, ...newStars];
    const unique = Array.from(new Map(combined.map((p) => [p.id, p])).values());
    setStarredPoints(unique);

    newStars.forEach((point) => {
      const graphic = new Graphic({
        geometry: new Point({
          longitude: point.longitude,
          latitude: point.latitude,
        }),
        symbol: new SimpleMarkerSymbol({
          style: "circle",
          size: 14,
          color: [255, 255, 255, 0],
          outline: {
            color: [0, 0, 255, 1],
            width: 2,
          },
        }),
        attributes: { id: point.id },
      });

      graphicsLayer.graphics.add(graphic);
    });

    logAction({
      message: `User starred point '${newStars[0].omschrijving}' in the list of starred points`,
      step: "ResultTab",
    });
  };

  const exportCsv = () => {
    const points = pointsTable as EnrichedPointType[];
    const headers = Object.keys(points[0]);
    const csv = [
      headers.join(","),
      ...points.map((p) =>
        headers.map((h) => `"${p[h as keyof EnrichedPointType]}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "points_export.csv");

    logAction({
      message: `User clicked 'Exporteer naar CSV'`,
      step: "ResultTab",
    });
  };

  const exportXlsx = () => {
    const points = pointsTable as EnrichedPointType[];
    const worksheet = XLSX.utils.json_to_sheet(points);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Points");

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "points_export.xlsx");

    logAction({
      message: `User clicked 'Exporteer naar XLSX'`,
      step: "ResultTab",
    });
  };

  const exportShp = async () => {
    const plans = pointsTable as EnrichedPointType[];

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

    logAction({
      message: `User clicked 'Exporteer naar shapefile'`,
      step: "ResultTab",
    });
  };

  const content = useContent();

  return (
    <div className="bg-white max-w-[250px] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] z-50">
      <div
        className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
        onClick={addPoint}
      >
        <IoMdAdd className="text-2xl text-primary mt-1" />
        <div className="">
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.addPoints.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.addPoints.subtitle}{" "}
          </p>
        </div>
      </div>

      <div
        className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
        onClick={tableView}
      >
        <ImTable2 className="text-2xl text-primary mt-1" />
        <div className="">
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.tableView.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.tableView.subtitle}
          </p>
        </div>
      </div>

      <div className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100">
        <FaListAlt className="text-2xl text-primary mt-1" />
        <div className="">
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.zoomAll.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.zoomAll.subtitle}
          </p>
        </div>
      </div>

      <div
        className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
        onClick={selectAll}
      >
        <PiSelectionForegroundThin className="text-2xl text-primary mt-1" />
        <div className="">
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.selectAll.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.selectAll.subtitle}
          </p>
        </div>
      </div>

      <div
        className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
        onClick={() => setFase("buffer")}
      >
        <TbBorderOuter className="text-2xl text-primary mt-1" />
        <div className="">
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.bufferOptions.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {
              content.layout.searchResult.listPointFunctions.bufferOptions
                .subtitle
            }
          </p>
        </div>
      </div>

      <div
        className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
        onClick={exportCsv}
      >
        <BsFiletypeCsv className="text-2xl text-primary mt-1" />
        <div className="">
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.exportCsv.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.exportCsv.subtitle}
          </p>
        </div>
      </div>

      <div
        className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
        onClick={exportXlsx}
      >
        <BsFiletypeXlsx className="text-2xl text-primary mt-1" />
        <div className="">
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.exportXlsx.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.exportXlsx.subtitle}
          </p>
        </div>
      </div>

      <div
        className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
        onClick={exportShp}
      >
        <BsFiletypeJson className="text-2xl text-primary mt-1" />
        <div className="">
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.exportShp.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.exportShp.subtitle}
          </p>
        </div>
      </div>

      <div className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100">
        <FaFolderOpen className="text-2xl text-primary mt-1" />
        <div className="">
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.openSaved.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.openSaved.subtitle}
          </p>
        </div>
      </div>

      <div className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100">
        <FaSave className="text-2xl text-primary mt-1" />
        <div className="">
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.saveResults.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {
              content.layout.searchResult.listPointFunctions.saveResults
                .subtitle
            }
          </p>
        </div>
      </div>

      <div className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100">
        <TbLayersLinked className="text-2xl text-primary mt-1" />
        <div className="">
          <p className="text-[14px] font-semibold text-gray-800">
            {
              content.layout.searchResult.listPointFunctions.combineResults
                .title
            }
          </p>
          <p className="text-[12px] text-gray-500">
            {
              content.layout.searchResult.listPointFunctions.combineResults
                .subtitle
            }
          </p>
        </div>
      </div>

      <div className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100">
        <MdDeleteOutline className="text-2xl text-primary mt-1" />
        <div className="">
          <p className="text-[14px] font-semibold text-gray-800">
            {
              content.layout.searchResult.listPointFunctions.removeFromResults
                .title
            }
          </p>
          <p className="text-[12px] text-gray-500">
            {
              content.layout.searchResult.listPointFunctions.removeFromResults
                .subtitle
            }
          </p>
        </div>
      </div>
    </div>
  );
}
