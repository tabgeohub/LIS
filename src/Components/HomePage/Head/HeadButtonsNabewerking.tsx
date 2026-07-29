import { useTabState } from "hooks/zustand/ui/tabState";
import { useOpeSideBarState } from "hooks/zustand/ui/openSideBar";
import { nabewerkingTabs } from "./constants";
import FilterTabs from "./Common/FilterTabs";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useResetFeatures } from "Components/HomePage/hooks/features/useResetFeatures";
import useHandleClosePopUp from "Components/HomePage/hooks/popUpModal/useHandleClosePopUp";
import useResetTabs from "Components/HomePage/hooks/tabs/useResetTabs";
import CommonTabBtn from "./Common/CommonTabBtn";
import { useContent } from "hooks/useContent";

export default function HeadButtonsNabewerking() {
  const { setSelectedTab } = useTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { resetFeatures } = useResetFeatures();

  const { graphicsLayer, graphicsLayerHover, redGraphicsLayer } =
    useMapViewState();

  const reset = useResetTabs();

  const handleClose = useHandleClosePopUp();

  const content = useContent();

  return (
    <div className="flex gap-x-1">
      <div className="border-gray-200 border-[1px] px-4 py-[1px] bg-white rounded-sm flex flex-col justify-between max-h-[120px]">
        <div className="flex gap-[10px] pt-2">
          {nabewerkingTabs.map((item) => (
            <CommonTabBtn
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
