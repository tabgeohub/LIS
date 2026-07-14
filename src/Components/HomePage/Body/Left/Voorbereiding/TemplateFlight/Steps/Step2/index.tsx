import { EnrichedPointType } from "Types";
import { useContent } from "hooks/useContent";
import { useTemplateFlightState } from "../../templateFlightStates";
import TemplateSelectionStep from "../TemplateSelectionStep";
import Buttons from "./Buttons";

export default function Step2({
  setOpenFilter,
  filteredPoints,
}: {
  setOpenFilter: (value: boolean) => void;
  filteredPoints: EnrichedPointType[];
}) {
  const state = useTemplateFlightState();
  const content = useContent();
  return (
    <TemplateSelectionStep
      repeat
      text={content.voorbereiding.vluchtenTemplate.step2.text}
      step={2}
      filteredPoints={filteredPoints}
      selectedPoints={state.selectedPoints}
      setSelectedPoints={state.setSelectedPoints}
      selectedGeometries={state.selectedGeometries}
      setSelectedGeometries={state.setSelectedGeometries}
      buttons={<Buttons setOpenFilter={setOpenFilter} />}
    />
  );
}
