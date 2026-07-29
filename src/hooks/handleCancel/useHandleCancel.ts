import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useTabState } from "hooks/zustand/ui/tabState";

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
