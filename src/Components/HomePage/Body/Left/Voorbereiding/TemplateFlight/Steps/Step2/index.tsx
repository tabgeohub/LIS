import ScrollButtonsLayout from "../../../../Common/ScrollButtonsLayout";
import PointsList from "../../PointsList";
import { useTemplateFlightState } from "../../templateFlightStates";
import Buttons from "./Buttons";
import { EnrichedPointType } from "Types";

export default function Step2({
  setOpenFilter,
  filteredPoints,
}: {
  setOpenFilter: (value: boolean) => void;
  filteredPoints: EnrichedPointType[];
}) {
  const { selectedPoints, setSelectedPoints } = useTemplateFlightState();

  return (
    <ScrollButtonsLayout
      className="h-[100%]"
      buttons={<Buttons setOpenFilter={setOpenFilter} />}
    >
      <PointsList
        selectedPoints={selectedPoints}
        setSelectedPoints={setSelectedPoints}
        points={filteredPoints.filter((point) => point.herhalen === 1)}
        step={2}
      />
    </ScrollButtonsLayout>
  );
}
