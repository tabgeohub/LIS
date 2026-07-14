import { EnrichedPointType } from "Types";
import { useContent } from "hooks/useContent";
import { useTemplateFlightState } from "../../templateFlightStates";
import TemplateSelectionStep from "../TemplateSelectionStep";
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
  const state = useTemplateFlightState();
  const content = useContent();
  return (
    <TemplateSelectionStep
      repeat={false}
      text={content.voorbereiding.vluchtenTemplate.step3.text}
      step={3}
      filteredPoints={filteredPoints}
      selectedPoints={state.selectedPoints2}
      setSelectedPoints={state.setSelectedPoints2}
      selectedGeometries={state.selectedGeometries2}
      setSelectedGeometries={state.setSelectedGeometries2}
      buttons={<Buttons setOpenFilter={setOpenFilter} name={name} />}
    />
  );
}
