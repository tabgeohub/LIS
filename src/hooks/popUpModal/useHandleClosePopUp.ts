import {
  initialPointState,
  usePopUpState,
} from "@helpers/ZustandStates/popUpState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import useLogAction from "hooks/useLogAction";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";

export default function useHandleClosePopUp() {
  const logAction = useLogAction();

  const { setClickedPointId, setClickedPoint, setOpenModal } = usePopUpState();
  const { selectedPointGraphicsLayer } = useMapViewState();

  const { selectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();

  function handleClose() {
    if (selectedTab === "none") {
      setSelectedBottomTab("Kaartlagenlijst");

      logAction({
        message: "User closed the pop-up",
      });
    }

    setClickedPointId(0);
    setClickedPoint(initialPointState);
    selectedPointGraphicsLayer?.removeAll();

    setOpenModal(false);
  }

  return handleClose;
}
