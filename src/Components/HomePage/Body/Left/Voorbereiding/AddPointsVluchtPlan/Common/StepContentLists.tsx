import PointsList from "../Common/PointsList";
import GeometriesList from "../../FlightPlan/Common/GeometriesList";
import Header from "../Common/Header";
import ScrollButtonsLayout from "../../../Common/ScrollButtonsLayout";
import type { Geometry } from "hooks/features/useGeometriesStore";

export default function StepContentLists(input: {
  herhalen: boolean;
  filterTerm: string;
  setFilterTerm: (value: string) => void;
  selectedGeometries: number[];
  setSelectedGeometries: (value: number[]) => void;
  filteredGeometries: Geometry[];
  displayedGeometries: Geometry[];
  selectedPoints: number[];
  setSelectedPoints: (value: number[]) => void;
  displayedPoints: unknown[];
  buttons: React.ReactNode;
}) {
  return (
    <>
      <Header
        herhalen={input.herhalen}
        filterTerm={input.filterTerm}
        setFilterTerm={input.setFilterTerm}
        selectedGeometries={input.selectedGeometries}
        setSelectedGeometries={input.setSelectedGeometries}
        filteredGeometries={input.filteredGeometries}
      />

      <ScrollButtonsLayout buttons={input.buttons}>
        <GeometriesList
          selectedGeometries={input.selectedGeometries}
          setSelectedGeometries={input.setSelectedGeometries}
          geometries={input.displayedGeometries}
        />
        <PointsList
          selectedPoints={input.selectedPoints}
          setSelectedPoints={input.setSelectedPoints}
          points={input.displayedPoints as never[]}
        />
      </ScrollButtonsLayout>
    </>
  );
}
