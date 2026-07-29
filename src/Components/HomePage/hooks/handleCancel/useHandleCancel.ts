import { useMapViewState } from "hooks/zustand/ui";
import { useTabState } from "hooks/zustand/ui";

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
