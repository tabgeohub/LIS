import { EnrichedPointType } from "Types";
import TemplateSelectionStep from "../TemplateSelectionStep";
import { useTemplateFlightSelectionStepProps } from "../useTemplateFlightSelectionStepProps";
import Buttons from "./Buttons";

export default function Step3({
  name,
  setOpenFilter,
  filteredPoints,
}: {
  name: string;
  setOpenFilter: (value: boolean) => void;
  filteredPoints: EnrichedPointType[];
}) {
  const selection = useTemplateFlightSelectionStepProps(3);
  return (
    <TemplateSelectionStep
      {...selection}
      filteredPoints={filteredPoints}
      buttons={<Buttons setOpenFilter={setOpenFilter} name={name} />}
    />
  );
}
