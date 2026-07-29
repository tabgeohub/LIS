import { EnrichedPointType } from "Types";
import TemplateSelectionStep from "../TemplateSelectionStep";
import { useTemplateFlightSelectionStepProps } from "../useTemplateFlightSelectionStepProps";
import Buttons from "./Buttons";

export default function Step2({
  setOpenFilter,
  filteredPoints,
}: {
  setOpenFilter: (value: boolean) => void;
  filteredPoints: EnrichedPointType[];
}) {
  const selection = useTemplateFlightSelectionStepProps(2);
  return (
    <TemplateSelectionStep
      {...selection}
      filteredPoints={filteredPoints}
      buttons={<Buttons setOpenFilter={setOpenFilter} />}
    />
  );
}
