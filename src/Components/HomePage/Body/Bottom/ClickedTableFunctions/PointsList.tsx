import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { MdOutlineZoomOutMap, MdTableChart } from "react-icons/md";

import { EnrichedPointType, FlightPlanType } from "Types";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { BsFiletypeCsv, BsFiletypeJson, BsFiletypeXlsx } from "react-icons/bs";
import { useOpenResultTab } from "@helpers/ZustandStates/showResultTab";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useOpenAllTable } from "@helpers/ZustandStates/showAllTable";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useOpenSearchedTab } from "@helpers/ZustandStates/showSearchedTab";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import JSZip from "jszip";
import shpwrite from "@mapbox/shp-write";
import { FeatureCollection, Point as pt } from "geojson";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function PointsList() {
  const logAction = useLogAction();

  const { pointsTable, setOpenTable, flightPlans } = useOpenTable();

  const { setOpenResultTab } = useOpenResultTab();
  const { setOpenSearchedTab } = useOpenSearchedTab();

  const { setOpenAllTable } = useOpenAllTable();
  const { setOpenSideBar } = useOpeSideBarState();

  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { selectedTab } = useTabState();

  const zoomToPoints = () => {};

  const listView = () => {
    if (selectedTab === "none") {
      setSelectedBottomTab("searched");
      setOpenSearchedTab(true);
    } else {
      setSelectedBottomTab("result");
      setOpenResultTab(true);
    }
    setOpenSideBar(true);
    setOpenAllTable(false);
    setOpenTable(false);

    logAction({
      message: "User clicked 'List view' button",
      step: "Clicked table functions",
    });
  };

  const exportCsv = async () => {
    if (pointsTable.length > 0 && flightPlans.length > 0) {
      const zip = new JSZip();

      const points = pointsTable as EnrichedPointType[];
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

      const plans = flightPlans as FlightPlanType[];

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
    } else if (pointsTable.length > 0 && flightPlans.length === 0) {
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
    } else if (pointsTable.length === 0 && flightPlans.length > 0) {
      const plans = flightPlans as FlightPlanType[];
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

      const blob = new Blob([csvPlans], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "plans_export.csv");
    }
  };

  const exportXlsx = async () => {
    if (pointsTable.length > 0 && flightPlans.length > 0) {
      const zip = new JSZip();

      // ===== 1. Points Excel =====
      const points = pointsTable as EnrichedPointType[];
      const wsPoints = XLSX.utils.json_to_sheet(points);
      const wbPoints = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wbPoints, wsPoints, "Points");
      const pointsBuffer = XLSX.write(wbPoints, {
        bookType: "xlsx",
        type: "array",
      });

      zip.file("points_export.xlsx", pointsBuffer);

      // ===== 2. Plans Excel (excluding "points" field) =====
      const plans = flightPlans as FlightPlanType[];
      const cleanedPlans = plans.map(({ points, ...rest }) => rest); // exclude "points"
      const wsPlans = XLSX.utils.json_to_sheet(cleanedPlans);
      const wbPlans = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wbPlans, wsPlans, "FlightPlans");
      const plansBuffer = XLSX.write(wbPlans, {
        bookType: "xlsx",
        type: "array",
      });

      zip.file("plans_export.xlsx", plansBuffer);

      // Generate zip blob
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "exports_xlsx.zip");
    } else if (pointsTable.length > 0 && flightPlans.length === 0) {
      const points = pointsTable as EnrichedPointType[];
      const wsPoints = XLSX.utils.json_to_sheet(points);
      const wbPoints = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wbPoints, wsPoints, "Points");
      const pointsBuffer = XLSX.write(wbPoints, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([pointsBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "points_export.xlsx");
    } else if (pointsTable.length === 0 && flightPlans.length > 0) {
      const plans = flightPlans as FlightPlanType[];
      const cleanedPlans = plans.map(({ points, ...rest }) => rest); // exclude "points"
      const wsPlans = XLSX.utils.json_to_sheet(cleanedPlans);
      const wbPlans = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wbPlans, wsPlans, "FlightPlans");
      const plansBuffer = XLSX.write(wbPlans, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([plansBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, "plans_export.xlsx");
    }
  };

  const exportShp = async () => {
    const zip = new JSZip();

    // ===== 1. Points (as Shapefile) =====
    const points = pointsTable;
    if (!points || points.length === 0) {
      alert("No points to export.");
      return;
    }

    const geojsonPoints: FeatureCollection<pt> = {
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

    const pointsShp = shpwrite.zip(geojsonPoints, {
      compression: "DEFLATE",
      outputType: "blob",
    });

    zip.file("points.zip", pointsShp);

    // ===== 3. Final Combined ZIP =====
    const finalZipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(finalZipBlob, "exports_shapefiles.zip");
  };

  const content = useContent();

  return (
    <div>
      <div
        className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
        onClick={listView}
      >
        <MdTableChart className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.bottomSection.pointsList.listView.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.bottomSection.pointsList.listView.subtitle}{" "}
          </p>
        </div>
      </div>

      <div
        className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
        onClick={zoomToPoints}
      >
        <MdOutlineZoomOutMap className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.bottomSection.pointsList.zoomToAll.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.bottomSection.pointsList.zoomToAll.subtitle}{" "}
          </p>
        </div>
      </div>

      <div
        className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
        onClick={exportCsv}
      >
        <BsFiletypeCsv className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.bottomSection.pointsList.exportCsv.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.bottomSection.pointsList.exportCsv.subtitle}{" "}
          </p>
        </div>
      </div>

      <div
        className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
        onClick={exportXlsx}
      >
        <BsFiletypeXlsx className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.bottomSection.pointsList.exportXlsx.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.bottomSection.pointsList.exportXlsx.subtitle}{" "}
          </p>
        </div>
      </div>

      <div
        className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
        onClick={exportShp}
      >
        <BsFiletypeJson className="text-2xl text-primary mt-1" />
        <div>
          <p className="text-[14px] font-semibold text-gray-800">
            {content.bottomSection.pointsList.exportShp.title}
          </p>
          <p className="text-[12px] text-gray-500">
            {content.bottomSection.pointsList.exportShp.subtitle}{" "}
          </p>
        </div>
      </div>
    </div>
  );
}
