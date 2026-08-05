import { useHoveredPlanState } from "hooks/zustand/hoveredPlanState";
import { FlightPlanType } from "Types";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { saveAs } from "file-saver";
import { useViewPlanState } from "Components/Voorbereiding/ViewPlan/useViewPlanState";
import { GoCheckCircleFill } from "react-icons/go";
import { TbCancel } from "react-icons/tb";
import dayjs from "dayjs";
import useLogAction from "hooks/useLogAction";
import { classNames } from "helpers/dom/classNames";
import { usePlanClick } from "hooks/hover-click/usePlanClick";
import usePlanHover from "hooks/hover-click/usePlanHover";
import { POINT_EXPORT_COLUMNS } from "helpers/points/pointColumnKeys";
import { buildFlightPlanPointExportRows } from "Components/HomePage/helpers/points/flightPlanPointExcel";
import { buildXlsxBuffer } from "Components/HomePage/helpers/tableExports/xlsxExport";

export default function SinglePlan({
  plan,
}: {
  index: number;
  plan: FlightPlanType;
}) {
  const logAction = useLogAction();
  const { handleClick } = usePlanClick();
  const { handleHover, handleMouseLeave } = usePlanHover();
  const { setHoveredPoints } = useHoveredPlanState();
  const { setSelectedPlan, selectedPlan } = useViewPlanState();

  const exportExcel = (plan: FlightPlanType) => {
    const columns = [...POINT_EXPORT_COLUMNS] as const;
    const rows = buildFlightPlanPointExportRows(plan);
    const wbout = buildXlsxBuffer({
      rows,
      sheetName: "Points",
      header: columns as unknown as string[],
    });
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
      onMouseEnter={() => handleHover(plan)}
      onMouseLeave={() => {
        setHoveredPoints(null);
        handleMouseLeave();
      }}
      onClick={() => {
        handleClick(plan, setSelectedPlan);
        logAction({
          message: "User selected a flight plan",
          step: "View plan",
          newData: { vluchtnummer: plan.vluchtnummer, planId: plan.id },
        });
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
