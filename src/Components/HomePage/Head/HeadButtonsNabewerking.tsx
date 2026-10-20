import { useMemo } from "react";
import { useTabState } from "hooks/zustand/ui";
import { useOpeSideBarState } from "hooks/zustand/ui";
import { nabewerkingTabs } from "./constants";
import FilterTabs from "./Common/FilterTabs";
import { useMapViewState } from "hooks/zustand/ui";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import useHandleClosePopUp from "Components/HomePage/hooks/popUpModal/useHandleClosePopUp";
import useResetTabs from "Components/HomePage/hooks/tabs/useResetTabs";
import CommonTabBtn from "./Common/CommonTabBtn";
import { useContent } from "hooks/useContent";
import { useCanEdit } from "hooks/useCanEdit";
import { applyViewerTabLocks } from "helpers/auth/viewerAccess";

export default function HeadButtonsNabewerking() {
  const { setSelectedTab } = useTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { resetFeatures } = useResetFeatures();
  const userCanEdit = useCanEdit();

  const { graphicsLayer, graphicsLayerHover, redGraphicsLayer } =
    useMapViewState();

  const reset = useResetTabs();

  const handleClose = useHandleClosePopUp();

  const content = useContent();

  const tabs = useMemo(
    () => applyViewerTabLocks(nabewerkingTabs, userCanEdit),
    [userCanEdit]
  );

  return (
    <div className="flex gap-x-1">
      <div className="border-gray-200 border-[1px] px-4 py-[1px] bg-white rounded-sm flex flex-col justify-between max-h-[120px]">
        <div className="flex gap-[10px] pt-2">
          {tabs.map((item) => (
            <CommonTabBtn
              key={item.id}
              item={item}
              onClick={() => {
                if (!item.disabled) {
                  handleClose();
                  reset();
                  setSelectedTab(item.id);
                  setOpenSideBar(true);
                  resetFeatures();
                  graphicsLayer?.removeAll();
                  graphicsLayerHover?.removeAll();
                  redGraphicsLayer?.removeAll();
                }
              }}
            />
          ))}
        </div>

        <p className="text-[10px] text-gray-400 tracking-normal text-center mt-2">
          {content.nabewerking.label}
        </p>
      </div>

      <FilterTabs />
    </div>
  );
}
