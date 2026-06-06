import { useHoveredPlanState } from "hooks/zustand/hoveredPlanState";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { EnrichedPointType, FlightPlanType } from "Types";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Polygon from "@arcgis/core/geometry/Polygon";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import Graphic from "@arcgis/core/Graphic";
import { useViewPlanState } from "hooks/zustand/voorbereiding/useViewPlanState";
import { GoCheckCircleFill } from "react-icons/go";
import { TbCancel } from "react-icons/tb";
import dayjs from "dayjs";
import useLogAction from "hooks/useLogAction";
import { classNames } from "@helpers/classNames";

export default function SinglePlan({
  index,
  plan,
}: {
  index: number;
  plan: FlightPlanType;
}) {
  const logAction = useLogAction();

  const { graphicsLayerHover, graphicsLayer } = useMapViewState();

  const { setHoveredPoints } = useHoveredPlanState();

  const { setSelectedPlan, selectedPlan } = useViewPlanState();

  const selectPlan = (plan: FlightPlanType) => {
    setSelectedPlan(plan);

    if (!graphicsLayer) return;

    setSelectedPlan(plan);

    graphicsLayer.removeAll();

    const points = plan?.points;
    if (!points || points.length === 0) return;

    const minLat = Math.min(...points.map((p) => p.latitude));
    const maxLat = Math.max(...points.map((p) => p.latitude));
    const minLon = Math.min(...points.map((p) => p.longitude));
    const maxLon = Math.max(...points.map((p) => p.longitude));

    const polygon = new Polygon({
      rings: [
        [
          [minLon, maxLat],
          [maxLon, maxLat],
          [maxLon, minLat],
          [minLon, minLat],
          [minLon, maxLat],
        ],
      ],
      spatialReference: { wkid: 4326 },
    });

    const fillSymbol = new SimpleFillSymbol({
      color: [227, 139, 79, 0],
      outline: { color: [0, 255, 0, 1], width: 2 },
    });

    const newPolygonGraphic = new Graphic({
      geometry: polygon,
      symbol: fillSymbol,
    });

    graphicsLayer.add(newPolygonGraphic);

    logAction({
      message: "User selected a flight plan",
      step: "View plan",
      newData: { vluchtnummer: plan.vluchtnummer, planId: plan.id },
    });
  };

  const HoveredPlan = (index: number) => {
    if (!graphicsLayerHover) return;

    let points = plan?.points;

    if (!points) return;

    const minLat = Math.min(...points.map((p) => p.latitude));
    const maxLat = Math.max(...points.map((p) => p.latitude));
    const minLon = Math.min(...points.map((p) => p.longitude));
    const maxLon = Math.max(...points.map((p) => p.longitude));

    const polygon = new Polygon({
      rings: [
        [
          [minLon, maxLat],
          [maxLon, maxLat],
          [maxLon, minLat],
          [minLon, minLat],
          [minLon, maxLat],
        ],
      ],
    });

    const fillSymbol = new SimpleFillSymbol({
      color: [227, 139, 79, 0],
      outline: { color: [227, 139, 79, 1], width: 2 },
    });

    const newPolygonGraphic = new Graphic({
      geometry: polygon,
      symbol: fillSymbol,
    });

    graphicsLayerHover.add(newPolygonGraphic);
  };

  const exportExcel = (plan: FlightPlanType) => {
    const columns = [
      "geometry",
      "omschrijving",
      "regio_id",
      "xcoordinaat_rd",
      "ycoordinaat_rd",
      "latitude",
      "longitude",
      "herhalen",
      "vertrouwelijk",
      "indiener_id",
      "activiteit_id",
      "organisatie_id",
      "specifiek_letten_op",
      "datum",
    ] as const;

    const toJaNee = (v: number): string => {
      if (typeof v === "boolean") return v ? "ja" : "nee";
      if (typeof v === "number") return v === 1 ? "ja" : "nee";
      const s = String(v ?? "")
        .trim()
        .toLowerCase();
      return s === "1" || s === "true" || s === "ja" || s === "yes"
        ? "ja"
        : "nee";
    };

    const toNumOrEmpty = (v: string | number): number | "" => {
      const n =
        typeof v === "string"
          ? parseFloat(v.replace(",", ".").replace(/\s/g, ""))
          : Number(v);
      return Number.isFinite(n) ? n : "";
    };

    const points = (plan.points as EnrichedPointType[]) ?? [];

    const rows = points.map((p) => {
      const geometry = `X: ${p.longitude}, Y: ${p.latitude}`;

      const datum = p.created_at;

      return {
        geometry,
        omschrijving: p.omschrijving ?? "",
        regio_id: p.regio_id ?? "",
        xcoordinaat_rd: toNumOrEmpty(p.xcoordinaat_rd),
        ycoordinaat_rd: toNumOrEmpty(p.ycoordinaat_rd),
        latitude: toNumOrEmpty(p.latitude),
        longitude: toNumOrEmpty(p.longitude),
        herhalen: toJaNee(p.herhalen),
        vertrouwelijk: toJaNee(p.vertrouwelijk),
        indiener_id: p.user_id,
        activiteit_id: p.activiteit_id ?? plan.activiteit_id ?? "",
        organisatie_id: p.organisatie_id ?? plan.organisatie_id ?? "",
        specifiek_letten_op: p.specifiek_letten_op ?? "",
        datum,
      };
    });

    const sheet = XLSX.utils.json_to_sheet(rows, {
      header: columns as unknown as string[],
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Points");

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, `${plan.vluchtnummer}.xlsx`);

    logAction({
      message: "User clicked 'Export' button to export a flight plan",
      step: "View plan",
      newData: {
        vluchtnummer: plan.vluchtnummer,
        planId: plan.id,
      },
    });
  };

  return (
    <div
      onMouseEnter={() => HoveredPlan(index)}
      onMouseLeave={() => {
        setHoveredPoints(null);
        if (graphicsLayerHover) {
          graphicsLayerHover.removeAll();
        }
      }}
      onClick={() => {
        selectPlan(plan);
      }}
      className={classNames(
        "hover:cursor-pointer hover:bg-gray-100 relative p-2",
        selectedPlan?.id === plan.id && " bg-gray-200",
        (plan.status === "in-progress" ||
          plan.status === "finished" ||
          plan.status === "canceled") &&
          " bg-neutral-200 "
      )}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-x-2">
          <FaMapMarkedAlt className="size-6 text-blue-500" />
          <p className="text-[12px]">{plan.vluchtnummer}</p>
        </div>
        <span className="my-auto">
          <PiMicrosoftExcelLogoFill
            className="text-blue-500 my-auto text-xl"
            onClick={() => exportExcel(plan)}
          />
        </span>
      </div>

      <div className="text-[10px] text-gray-500 mt-2">
        <p>Omschrijving: {plan.omschrijving}</p>
        <p>Doel en hoofdthema: {plan.hoofdthema}</p>
        <p>Aanvullende informatie: {plan.aanvullende}</p>
        <p>Inspectiedatum: {dayjs(plan.datum).format("YYYY-MM-DD")}</p>
      </div>

      {plan.status === "in-progress" && (
        <FaLock className="absolute bottom-2 right-3 text-gray-500" />
      )}

      {plan.status === "finished" && (
        <GoCheckCircleFill className="absolute bottom-2 right-3 text-green-500" />
      )}

      {plan.status === "canceled" && (
        <TbCancel className="absolute bottom-2 right-3 text-red-500" />
      )}
    </div>
  );
}
