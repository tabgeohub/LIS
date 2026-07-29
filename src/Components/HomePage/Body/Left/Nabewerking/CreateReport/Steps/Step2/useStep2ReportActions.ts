import { useConstSelectOptions } from "hooks/consts/useConstSelectOptions";
import { useHandleStep2 } from "../../helpers/useHandleStep2";
import { useCreateReportState } from "Components/HomePage/hooks/zustand/nabewerking/useCreateReportState";

export function useStep2ReportActions() {
  const activities = useConstSelectOptions("activiteiten");
  const organizations = useConstSelectOptions("organisaties");
  const report = useCreateReportState();
  const handleStep2 = useHandleStep2({
    selectedPlan: report.selectedPlan!,
    selectedPoints: report.selectedPoints!,
    selectedGeometries: report.selectedGeometries!,
    setZipFile: report.setZipFile,
    setZippingStatus: report.setZippingStatus,
    activities,
    organizations,
  });
  return { report, handleStep2 };
}
