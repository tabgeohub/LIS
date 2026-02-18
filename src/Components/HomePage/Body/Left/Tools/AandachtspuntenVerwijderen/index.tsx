import Main from "./Actions/Main";
import EditPointDetails from "./Actions/EditPointDetails";
import DeletePoint from "./Actions/DeletePoint";
import ViewPlans from "./Actions/ViewPlans";
import AddToPlan from "./Actions/AddToPlan";
import Filter from "./Actions/Filter";
import { usePointsStore } from "hooks/features/usePointsStore";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";

export default function AandachtspuntenVerwijderen() {
  const { mainStep } = useDeletePointState();
  const { points } = usePointsStore();

  if (!points) return null;

  return (
    <div className="h-full">
      {mainStep === "main" && <Main />}

      {mainStep === "editSelectedPoint" && <EditPointDetails />}

      {mainStep === "deletePoint" && <DeletePoint />}

      {mainStep === "viewPlans" && <ViewPlans />}

      {mainStep === "addToPlan" && <AddToPlan />}

      {mainStep === "filter" && <Filter />}
    </div>
  );
}
