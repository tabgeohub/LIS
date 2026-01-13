import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import SelectedPointDetails from "../SelectedPoint/SelectedPointDetails";
import EditPointDetails from "../SelectedPoint/EditPointDetails";
import DeletePoint from "../SelectedPoint/DeletePoint";
import AddToPlan from "../SelectedPoint/AddToPlan";
import ViewPlans from "../SelectedPoint/ViewPlans";

export default function SelectedPointTabs() {
  const { clickedPoint } = usePopUpState();
  const { selectedBottomTab } = useSelectedBottomTabState();

  if (clickedPoint.id === 0) return null;

  const TabComponents = {
    viewSelectedPointDetails: SelectedPointDetails,
    editSelectedPoint: EditPointDetails,
    deletePoint: DeletePoint,
    viewPlans: ViewPlans,
    addToPlan: AddToPlan,
  };

  // @ts-ignore
  const ActiveComponent = TabComponents[selectedBottomTab];

  return <>{ActiveComponent && <ActiveComponent />}</>;
}
