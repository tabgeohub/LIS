import { useCreateReportState } from "Components/Nabewerking/CreateReport/state/useCreateReportState";
import PeriodFilterPanel from "Components/HomePage/Body/Left/Common/PeriodFilterPanel";

export default function PeriodFilter() {
  return <PeriodFilterPanel store={useCreateReportState()} />;
}
