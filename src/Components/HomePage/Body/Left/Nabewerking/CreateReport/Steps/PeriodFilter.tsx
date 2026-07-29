import { useCreateReportState } from "Components/HomePage/hooks/zustand/nabewerking/useCreateReportState";
import PeriodFilterPanel from "../../../Common/PeriodFilterPanel";

export default function PeriodFilter() {
  return <PeriodFilterPanel store={useCreateReportState()} />;
}
