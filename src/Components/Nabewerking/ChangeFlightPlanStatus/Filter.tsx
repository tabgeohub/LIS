import { useChangePlanStatusState } from "Components/HomePage/hooks/zustand/nabewerking/useChangePlanStatusState";
import PeriodFilterPanel from "Components/HomePage/Body/Left/Common/PeriodFilterPanel";

export default function Filter() {
  return <PeriodFilterPanel store={useChangePlanStatusState()} />;
}
