import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import PeriodFilterPanel from "./PeriodFilterPanel";

export default function PeriodFilter() {
  return <PeriodFilterPanel store={useFinishedPlansState()} />;
}
