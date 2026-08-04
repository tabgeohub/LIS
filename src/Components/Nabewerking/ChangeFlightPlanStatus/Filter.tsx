import { useChangePlanStatusState } from "Components/Nabewerking/ChangeFlightPlanStatus/useChangePlanStatusState";
import PeriodFilterPanel from "Components/HomePage/Body/Left/Common/PeriodFilterPanel";

export default function Filter() {
  return <PeriodFilterPanel store={useChangePlanStatusState()} />;
}
