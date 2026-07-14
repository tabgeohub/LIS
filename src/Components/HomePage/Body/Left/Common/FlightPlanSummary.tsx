import dayjs from "dayjs";
import { ReactNode } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";

type FlightPlanSummaryData = {
  vluchtnummer?: string;
  omschrijving?: string;
  hoofdthema?: string;
  aanvullende?: string;
  datum: string;
};

type FlightPlanSummaryLabels = {
  description: string;
  theme: string;
  additional: string;
  inspectionDate: string;
};

const defaultLabels: FlightPlanSummaryLabels = {
  description: "Omschrijving",
  theme: "Doel en hoofdthema",
  additional: "Aanvullende informatie",
  inspectionDate: "Inspectiedatum",
};

export default function FlightPlanSummary({
  plan,
  labels = defaultLabels,
  trailing,
  dateFormat = "YYYY-MM-DD",
}: {
  plan: FlightPlanSummaryData;
  labels?: FlightPlanSummaryLabels;
  trailing?: ReactNode;
  dateFormat?: string;
}) {
  return (
    <>
      <div className="flex items-center gap-x-2">
        <FaMapMarkedAlt className="size-6 text-blue-500" />
        <p className="text-[12px]">{plan.vluchtnummer}</p>
      </div>
      <div className="text-[10px] text-gray-500 mt-2">
        <p>{labels.description}: {plan.omschrijving}</p>
        <p>{labels.theme}: {plan.hoofdthema}</p>
        <p>{labels.additional}: {plan.aanvullende}</p>
        <p>{labels.inspectionDate}: {dayjs(plan.datum).format(dateFormat)}</p>
      </div>
      {trailing}
    </>
  );
}
