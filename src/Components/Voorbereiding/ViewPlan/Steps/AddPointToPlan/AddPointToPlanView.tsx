import Header from "./Header";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import WizardLoadingOverlay from "Components/HomePage/Body/Common/Wizard/WizardLoadingOverlay";
import PointsList from "./PointsList";
import GeometriesList from "../../../FlightPlan/Common/GeometriesList";
import type { useAddPointToPlanModel } from "./useAddPointToPlanModel";

type Model = ReturnType<typeof useAddPointToPlanModel>;

export function AddPointToPlanView({ model }: { model: Model }) {
  return (
    <ScrollButtonsLayout
      buttons={
        <Buttons
          selectedPointIds={model.selectedPointIds}
          selectedGeometryIds={model.selectedGeometryIds}
          update={model.update}
        />
      }
    >
      <WizardLoadingOverlay show={model.loading} variant="stacked" />
      <AddPointToPlanLists model={model} />
    </ScrollButtonsLayout>
  );
}

function AddPointToPlanLists({ model }: { model: Model }) {
  return (
    <>
      <Header
        setSelectedPointIds={model.setSelectedPointIds}
        filteredPoints={model.filteredPoints}
        filter={model.filter}
        setFilter={model.setFilter}
      />
      <GeometriesList
        selectedGeometries={model.selectedGeometryIds}
        setSelectedGeometries={model.setSelectedGeometryIds}
        geometries={model.filteredGeometries}
      />
      <PointsList
        filteredPoints={model.filteredPoints}
        filter={model.filter}
        selectedPointIds={model.selectedPointIds}
        setSelectedPointIds={model.setSelectedPointIds}
      />
    </>
  );
}
