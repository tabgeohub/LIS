import { useFinishedPlansState } from "Components/Nabewerking/VluchtenZoeken/useFinishedPlansState";
import PeriodFilterPanel from "./PeriodFilterPanel";

export default function PeriodFilter() {
  return <PeriodFilterPanel store={useFinishedPlansState()} />;
}
