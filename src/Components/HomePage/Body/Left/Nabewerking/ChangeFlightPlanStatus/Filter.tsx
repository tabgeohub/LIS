import { useChangePlanStatusState } from "hooks/zustand/nabewerking/useChangePlanStatusState";
import PeriodFilterPanel from "../../Common/PeriodFilterPanel";

export default function Filter() {
  return <PeriodFilterPanel store={useChangePlanStatusState()} />;
}
