import PeriodFilterPanel from "Components/Common/PeriodFilterPanel";
import { useFinishedPlansState } from "./useFinishedPlansState";

export default function PeriodFilter() {
  return <PeriodFilterPanel store={useFinishedPlansState()} />;
}
