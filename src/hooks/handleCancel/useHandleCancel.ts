import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useTabState } from "@helpers/ZustandStates/tabState";

export function useHandleCancel() {
  const { setSelectedTab } = useTabState();
  const { clearGraphics } = useMapViewState();

  function handleCancel(clear?: () => void) {
    if (clear) clear();

    clearGraphics();
    setSelectedTab("none");
  }

  return handleCancel;
}
