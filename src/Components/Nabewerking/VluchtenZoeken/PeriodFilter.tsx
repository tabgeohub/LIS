import PeriodFilterPanel from "Components/Common/PeriodFilterPanel";
import { useFinishedPlansState } from "./useFinishedPlansState";

/** Period filter for finished-flight search (Vluchten zoeken). */
export default function PeriodFilter() {
  const store = useFinishedPlansState();
  return <PeriodFilterPanel store={store} />;
}
