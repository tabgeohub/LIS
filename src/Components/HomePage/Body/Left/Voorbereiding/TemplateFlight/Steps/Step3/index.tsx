import { useTemplateFlightState } from "../../templateFlightStates";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import { EnrichedPointType } from "Types";
import PointsList from "../../PointsList";

export default function Step3({
  name,
  setOpenFilter,
  filteredPoints,
}: {
  name: string;
  setOpenFilter: (value: boolean) => void;
  filteredPoints: EnrichedPointType[];
}) {
  const { selectedPoints2, setSelectedPoints2 } = useTemplateFlightState();

  return (
    <ScrollButtonsLayout
      className="h-[100%]"
      buttons={<Buttons setOpenFilter={setOpenFilter} name={name} />}
    >
      <PointsList
        selectedPoints={selectedPoints2}
        setSelectedPoints={setSelectedPoints2}
        points={filteredPoints.filter((point) => point.herhalen === 0)}
        step={3}
      />
    </ScrollButtonsLayout>
  );
}
