import {
  initialPointState,
  usePopUpState,
} from "hooks/zustand/ui/popUpState";
import { useSelectedBottomTabState } from "hooks/zustand/ui/selectedBottomTabState";
import { useTabState } from "hooks/zustand/ui/tabState";
import useLogAction from "hooks/useLogAction";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";

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
