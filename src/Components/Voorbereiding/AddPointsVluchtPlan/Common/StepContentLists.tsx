import PointsList from "Components/Voorbereiding/AddPointsVluchtPlan/Common/PointsList";
import GeometriesList from "../../FlightPlan/Common/GeometriesList";
import Header from "Components/Voorbereiding/AddPointsVluchtPlan/Common/Header";
import ScrollButtonsLayout from "Components/Common/ScrollButtonsLayout";
import type { StepContentListSelectionProps } from "./stepContentListSelectionProps";

function pickHeaderProps(
  input: StepContentListSelectionProps & { herhalen: boolean }
) {
  return {
    herhalen: input.herhalen,
    filterTerm: input.filterTerm,
    setFilterTerm: input.setFilterTerm,
    selectedGeometries: input.selectedGeometries,
    setSelectedGeometries: input.setSelectedGeometries,
    filteredGeometries: input.filteredGeometries as
      | { id: number; herhalen: number | string | boolean }[]
      | undefined,
  };
}

export default function StepContentLists(
  input: StepContentListSelectionProps & { herhalen: boolean }
) {
  return (
    <>
      <Header {...pickHeaderProps(input)} />

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
