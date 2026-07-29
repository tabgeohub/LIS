import { CgClose } from "react-icons/cg";
import { useConstSelectOptions } from "hooks/consts/useConstSelectOptions";
import { initialPointState, usePopUpState } from "hooks/zustand/ui/popUpState";
import { useTabState } from "hooks/zustand/ui/tabState";
import { useSelectedBottomTabState } from "hooks/zustand/ui/selectedBottomTabState";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { buildSelectedPointDetails } from "./selectedPointDetailsData";
import { SelectedPointActions } from "./SelectedPointActions";
import { SelectedPointDetailsList } from "./SelectedPointDetailsList";

export default function SelectedPointDetails() {
  const logAction = useLogAction();
  const organizations = useConstSelectOptions("organisaties");
  const activities = useConstSelectOptions("activiteiten");
  const { setClickedPointId, clickedPoint, setClickedPoint } = usePopUpState();
  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const content = useContent();
  const labels = content.bottomSection.editPointTabs;
  const selectAction = (options: {
    tab: Parameters<typeof setSelectedBottomTab>[0];
    message: string;
  }) => () => {
    setSelectedBottomTab(options.tab);
    logAction({ message: options.message, step: "Selected point details" });
  };
  const actions = [
    { label: labels.editPoint, onClick: selectAction({ tab: "editSelectedPoint", message: "User clicked 'Aandachtspunt wijzigen' button" }) },
    { label: labels.deletePoint, onClick: selectAction({ tab: "deletePoint", message: "User clicked 'Delete point' button" }) },
    { label: labels.viewObservations, onClick: selectAction({ tab: "viewPlans", message: "User clicked 'View plans' button" }) },
    { label: labels.addToPlan, onClick: selectAction({ tab: "addToPlan", message: "User clicked 'Add to plan' button" }) },
  ];
  const handleClose = () => {
    setSelectedBottomTab("Kaartlagenlijst");
    setSelectedTab("none");
    setClickedPointId(0);
    setClickedPoint(initialPointState);
    logAction({ message: "User clicked close icon", step: "Selected point details" });
  };

  return <div className="p-3">
    <div className="flex justify-between items-center">
      <p className="text-lg text-gray-500">Beschrijving</p>
      <button onClick={handleClose}><CgClose className="text-gray-400" /></button>
    </div>
    <SelectedPointActions actions={actions} />
    <p className="text-lg text-gray-500 my-2">{labels.details}</p>
    <SelectedPointDetailsList details={buildSelectedPointDetails({ point: clickedPoint, activities, organizations })} />
  </div>;
}
