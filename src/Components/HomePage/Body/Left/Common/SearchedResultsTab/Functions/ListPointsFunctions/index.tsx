import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { EnrichedPointType, FlightPlanType } from "Types";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { BsFiletypeCsv, BsFiletypeJson, BsFiletypeXlsx } from "react-icons/bs";
import { useOpenSearchedTab } from "@helpers/ZustandStates/showSearchedTab";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import JSZip from "jszip";
import {
  MdDonutLarge,
  MdFolderOpen,
  MdLayers,
  MdOutlineZoomOutMap,
  MdSave,
  MdTableChart,
} from "react-icons/md";
import { useContent } from "hooks/useContent";

export default function ListPointFunctions({
  setFase,
  pointsData,
  flightPlansData,
}: {
  setFase: (value: string) => void;
  pointsData: EnrichedPointType[];
  flightPlansData: FlightPlanType[];
}) {
  const { setPointsTable, setView, setOpenTable, setFlightPlans } =
    useOpenTable();

  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { setSelectedTab } = useTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { setOpenSearchedTab } = useOpenSearchedTab();

  const tableView = () => {
    setOpenTable(true);
    setPointsTable(pointsData);
    setFlightPlans(flightPlansData);
    setView("points");
    setSelectedBottomTab("topTabs");
    setSelectedTab("none");
    setOpenSearchedTab(false);
    setOpenSideBar(false);
  };

  const exportCsv = async () => {
    const zip = new JSZip();

    const points = pointsData as EnrichedPointType[];
    const headersPoints = Object.keys(points[0]);
    const csvPoints = [
      headersPoints.join(","),
      ...points.map((p) =>
        headersPoints
          .map((h) => `"${p[h as keyof EnrichedPointType]}"`)
          .join(",")
      ),
    ].join("\n");

    zip.file("points_export.csv", csvPoints);

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

    zip.file("plans_export.csv", csvPlans);

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "exports.zip");
  };

  const exportXlsx = async () => {
    const zip = new JSZip();

    // ===== 1. Points Excel =====
    const points = pointsData as EnrichedPointType[];
    const wsPoints = XLSX.utils.json_to_sheet(points);
    const wbPoints = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wbPoints, wsPoints, "Points");
    const pointsBuffer = XLSX.write(wbPoints, {
      bookType: "xlsx",
      type: "array",
    });

    zip.file("points_export.xlsx", pointsBuffer);

    // ===== 2. Plans Excel (excluding "points" field) =====
    const plans = flightPlansData as FlightPlanType[];

    const cleanedPlans = plans.map(({ points, ...rest }) => rest);
    const wsPlans = XLSX.utils.json_to_sheet(cleanedPlans);
    const wbPlans = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wbPlans, wsPlans, "FlightPlans");
    const plansBuffer = XLSX.write(wbPlans, {
      bookType: "xlsx",
      type: "array",
    });

    zip.file("plans_export.xlsx", plansBuffer);

    // ===== Generate and download ZIP =====
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "exports_xlsx.zip");
  };

  const exportShp = async () => {
    const zip = new JSZip();

    const points = pointsData;

    if (!points || points.length === 0) {
      alert("No points to export.");
      return;
    }

    // ===== 1. Points GeoJSON =====
    const geojsonPoints = {
      type: "FeatureCollection",
      features: points.map((p) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [p.longitude, p.latitude],
        },
        properties: {
          id: p.id,
          omschrijving: p.omschrijving,
          regio_id: p.regio_id,
          datum: p.datum,
          vertrouwelijk: p.vertrouwelijk,
          order: p.order,
          region: p.region,
        },
      })),
    };

    zip.file("points.geojson", JSON.stringify(geojsonPoints, null, 2));

    // ===== 2. Plans GeoJSON (if applicable) =====
    const plans = flightPlansData as FlightPlanType[];

    const geojsonPlans = {
      type: "FeatureCollection",
      features: plans.map(({ points, ...rest }) => ({
        type: "Feature",
        geometry: null,
        properties: rest,
      })),
    };

    zip.file("plans.geojson", JSON.stringify(geojsonPlans, null, 2));

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "exports_geojson.zip");
  };

  const content = useContent();

  return (
    <div className="absolute top-[100%] right-0 z-10 bg-white rounded-md shadow-md w-[350px] max-h-[330px] overflow-y-auto border border-gray-300 thin-scrollbar">
      <div
        className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b"
        onClick={tableView}
      >
        <div>
          <MdTableChart className="text-2xl text-primary mt-1" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.tableView.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.tableView.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b">
        <MdOutlineZoomOutMap className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.zoomAll.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.zoomAll.subtitle}
          </p>
        </div>
      </div>

      <div
        className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b"
        onClick={() => setFase("buffer")}
      >
        <MdDonutLarge className="text-2xl text-primary mt-1" />
        <div>
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
        className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b"
        onClick={exportCsv}
      >
        <BsFiletypeCsv className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.exportCsv.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.exportCsv.subtitle}
          </p>
        </div>
      </div>

      <div
        className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b"
        onClick={exportXlsx}
      >
        <BsFiletypeXlsx className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.exportXlsx.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.exportXlsx.subtitle}
          </p>
        </div>
      </div>

      <div
        className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b"
        onClick={exportShp}
      >
        <BsFiletypeJson className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.exportShp.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.exportShp.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b">
        <MdFolderOpen className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.layout.searchResult.listPointFunctions.openSaved.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.layout.searchResult.listPointFunctions.openSaved.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b">
        <MdSave className="text-2xl text-primary mt-1" />
        <div>
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

      <div className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer border-b">
        <MdLayers className="text-2xl text-primary mt-1" />
        <div>
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
    </div>
  );
}
