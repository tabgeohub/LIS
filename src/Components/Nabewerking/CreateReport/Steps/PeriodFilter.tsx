import { useCreateReportState } from "Components/HomePage/hooks/zustand/nabewerking/useCreateReportState";
import PeriodFilterPanel from "Components/HomePage/Body/Left/Common/PeriodFilterPanel";

export default function PeriodFilter() {
  return <PeriodFilterPanel store={useCreateReportState()} />;
}
