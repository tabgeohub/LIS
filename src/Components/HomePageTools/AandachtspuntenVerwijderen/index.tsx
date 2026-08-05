import type { ComponentType } from "react";
import Main from "./Actions/Main";
import EditPointDetails from "./Actions/EditPointDetails";
import DeletePoint from "./Actions/DeletePoint";
import ViewPlans from "./Actions/ViewPlans";
import AddToPlan from "./Actions/AddToPlan";
import Filter from "./Actions/Filter";
import { usePointsStore } from "hooks/features";
import {
  useDeletePointState,
} from "Components/HomePageTools/AandachtspuntenVerwijderen/state/useDeletePointState";
import type { AandachtspuntenVerwijderenType } from "./state/deletePointStateTypes";

const STEP_COMPONENTS: Partial<
  Record<AandachtspuntenVerwijderenType, ComponentType>
> = {
  main: Main,
  editSelectedPoint: EditPointDetails,
  deletePoint: DeletePoint,
  viewPlans: ViewPlans,
  addToPlan: AddToPlan,
  filter: Filter,
};

export default function AandachtspuntenVerwijderen() {
  const { mainStep } = useDeletePointState();
  const { points } = usePointsStore();

  if (!points) return null;

  const Active = STEP_COMPONENTS[mainStep];
  if (!Active) return null;

  return (
    <div className="h-full">
      <Active />
    </div>
  );
}
