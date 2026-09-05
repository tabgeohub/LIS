import type { ComponentType } from "react";
import { usePopUpState } from "hooks/zustand/ui";
import { useSelectedBottomTabState } from "hooks/zustand/ui";
import SelectedPointDetails from "../SelectedPoint/SelectedPointDetails";
import EditPointDetails from "../SelectedPoint/EditPointDetails";
import DeletePoint from "../SelectedPoint/DeletePoint";
import AddToPlan from "../SelectedPoint/AddToPlan";
import ViewPlans from "../SelectedPoint/ViewPlans";

type SelectedPointTabKey =
  | "viewSelectedPointDetails"
  | "editSelectedPoint"
  | "deletePoint"
  | "viewPlans"
  | "addToPlan";

const TAB_COMPONENTS: Record<SelectedPointTabKey, ComponentType> = {
  viewSelectedPointDetails: SelectedPointDetails,
  editSelectedPoint: EditPointDetails,
  deletePoint: DeletePoint,
  viewPlans: ViewPlans,
  addToPlan: AddToPlan,
};

function isSelectedPointTab(tab: string): tab is SelectedPointTabKey {
  return tab in TAB_COMPONENTS;
}

export default function SelectedPointTabs() {
  const { clickedPoint } = usePopUpState();
  const { selectedBottomTab } = useSelectedBottomTabState();

  if (clickedPoint.id === 0) return null;
  if (!isSelectedPointTab(selectedBottomTab)) return null;

  const ActiveComponent = TAB_COMPONENTS[selectedBottomTab];
  return <ActiveComponent />;
}
