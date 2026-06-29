import { useStarredAll } from "@helpers/ZustandStates/starredAll";
import { EnrichedPointType, FlightPlanType } from "Types";
import { saveAs } from "file-saver";
import * as XLSX from "@e965/xlsx";
import shpwrite from "@mapbox/shp-write";
import {
  FeatureCollection,
  Point as pt,
  Feature,
  Polygon as pl,
} from "geojson";
import JSZip from "jszip";
import { FaListAlt, FaSave, FaFolderOpen } from "react-icons/fa";
import { BsFiletypeCsv, BsFiletypeJson, BsFiletypeXlsx } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import { PiSelectionForegroundThin } from "react-icons/pi";
import { TbBorderOuter, TbLayersLinked } from "react-icons/tb";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function GroupFunctions({
  setFase,
  target,
  pointsData,
  flightPlansData,
}: {
  setFase: (value: string) => void;
  target: string;
  pointsData: EnrichedPointType[];
  flightPlansData: FlightPlanType[];
}) {
  const logAction = useLogAction();

  const { setStarredAll } = useStarredAll();

  const selectAll = () => {
    setStarredAll(true);

    logAction({
      message: "User selected all items",
      step: `Searched results - ${target} drop down`,
    });
  };

  const exportCsv = () => {
    if (target === "points") {
      const points = pointsData as EnrichedPointType[];
      const headers = Object.keys(points[0]);
      const csv = [
        headers.join(","),
        ...points.map((p) =>
          headers.map((h) => `${p[h as keyof EnrichedPointType]}`).join(",")
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "points_export.csv");

      logAction({
        message: "User exported points to CSV",
        step: `Searched results - ${target} drop down`,
      });
    } else {
      const plans = flightPlansData as FlightPlanType[];
      const headers = Object.keys(plans[0]);
      const csv = [
        headers.join(","),
        ...plans.map((p) =>
          headers
            .map((h) => {
              const value = p[h as keyof FlightPlanType];
              if (h === "points" && Array.isArray(value)) {
                return `${value
                  .map(
                    (pt) =>
                      `id:${pt.id}, x:${pt.xcoordinaat_rd}, y:${pt.ycoordinaat_rd}`
                  )
                  .join(" | ")}`;
              }

              const stringVal =
                typeof value === "string"
                  ? value.replace(/"/g, '""')
                  : String(value ?? "");
              return `${stringVal}`;
            })
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, "plans_export.csv");

      logAction({
        message: "User exported flight plans to CSV",
        step: `Searched results - ${target} drop down`,
      });
    }
  };

  const exportXlsx = () => {
    if (target === "points") {
      const points = pointsData as EnrichedPointType[];
      const worksheet = XLSX.utils.json_to_sheet(points);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Points");

      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      saveAs(blob, "points_export.xlsx");

      logAction({
        message: "User exported points to XLSX",
        step: `Searched results - ${target} drop down`,
      });
    } else {
      const plans = flightPlansData as FlightPlanType[];

      const flattenedPlans = plans.map((plan) => {
        const formattedPoints = Array.isArray(plan.points)
          ? plan.points
              .map(
                (pt) =>
                  `id:${pt.id}, x:${pt.xcoordinaat_rd}, y:${pt.ycoordinaat_rd}`
              )
              .join(" | ")
          : "";

        return {
          ...plan,
          points: formattedPoints,
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(flattenedPlans);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Plans");

      const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      saveAs(blob, "plans_export.xlsx");

      logAction({
        message: "User exported flight plans to XLSX",
        step: `Searched results - ${target} drop down`,
      });
    }
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

    logAction({
      message: "User created a quadrant polygon",
      step: `Searched results - ${target} drop down`,
    });

    return polygon;
  }

  const exportShp = async () => {
    if (target === "points") {
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

      logAction({
        message: "User exported flight plans to shapefile",
        step: `Searched results - ${target} drop down`,
      });
    } else {
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

      logAction({
        message: "User exported flight plans to shapefile",
        step: `Searched results - ${target} drop down`,
      });
    }
  };

  const content = useContent();

  return (
    <div className="bg-white max-w-[250px] shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] z-50">
      <ButtonItem
        target={target}
        icon={<FaListAlt />}
        title={content.layout.searchResult.listPointFunctions.zoomAll.title}
        description={
          content.layout.searchResult.listPointFunctions.zoomAll.subtitle
        }
        onClick={() => {}}
      />

      <ButtonItem
        target={target}
        icon={<PiSelectionForegroundThin />}
        title={content.layout.searchResult.listPointFunctions.selectAll.title}
        description={
          content.layout.searchResult.listPointFunctions.selectAll.subtitle
        }
        onClick={selectAll}
      />

      <ButtonItem
        target={target}
        icon={<TbBorderOuter />}
        title={
          content.layout.searchResult.listPointFunctions.bufferOptions.title
        }
        description={
          content.layout.searchResult.listPointFunctions.bufferOptions.subtitle
        }
        onClick={() => setFase("buffer")}
      />

      <ButtonItem
        target={target}
        icon={<BsFiletypeCsv />}
        title={content.layout.searchResult.listPointFunctions.exportCsv.title}
        description={
          content.layout.searchResult.listPointFunctions.exportCsv.subtitle
        }
        onClick={exportCsv}
      />

      <ButtonItem
        target={target}
        icon={<BsFiletypeXlsx />}
        title={content.layout.searchResult.listPointFunctions.exportXlsx.title}
        description={
          content.layout.searchResult.listPointFunctions.exportXlsx.subtitle
        }
        onClick={exportXlsx}
      />

      <ButtonItem
        target={target}
        icon={<BsFiletypeJson />}
        title={content.layout.searchResult.listPointFunctions.exportShp.title}
        description={
          content.layout.searchResult.listPointFunctions.exportShp.subtitle
        }
        onClick={exportShp}
      />

      <ButtonItem
        target={target}
        icon={<FaFolderOpen />}
        title={content.layout.searchResult.listPointFunctions.openSaved.title}
        description={
          content.layout.searchResult.listPointFunctions.openSaved.subtitle
        }
        onClick={() => {}}
      />

      <ButtonItem
        target={target}
        icon={<FaSave />}
        title={content.layout.searchResult.listPointFunctions.saveResults.title}
        description={
          content.layout.searchResult.listPointFunctions.saveResults.subtitle
        }
        onClick={() => {}}
      />

      <ButtonItem
        target={target}
        icon={<TbLayersLinked />}
        title={
          content.layout.searchResult.listPointFunctions.combineResults.title
        }
        description={
          content.layout.searchResult.listPointFunctions.combineResults.subtitle
        }
        onClick={() => {}}
      />

      <ButtonItem
        target={target}
        icon={<MdDeleteOutline />}
        title={
          content.layout.searchResult.listPointFunctions.removeFromResults.title
        }
        description={
          content.layout.searchResult.listPointFunctions.removeFromResults
            .subtitle
        }
        onClick={() => {}}
      />
    </div>
  );
}

const ButtonItem = ({
  icon,
  title,
  description,
  onClick,
  target,
}: {
  icon: JSX.Element;
  title: string;
  description: string;
  onClick: () => void;
  target: string;
}) => {
  const logAction = useLogAction();

  return (
    <div
      className="flex gap-x-4 px-2 border-[1px] py-2 hover:bg-blue-100"
      onClick={() => {
        onClick();

        logAction({
          message: `User clicked ${title} button in ${target} drop down`,
          step: "Searched results",
        });
      }}
    >
      <div className="text-gray-500 text-xl my-auto">{icon}</div>
      <div>
        <p className="text-gray-800 text-sm font-semibold">{title}</p>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  );
};
