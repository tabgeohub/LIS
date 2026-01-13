import { useTabState } from "@helpers/ZustandStates/tabState";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { nabewerkingTabs } from "./constants";
import FilterTabs from "./Common/FilterTabs";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { usePointsStore } from "hooks/zustand/usePointsStore";
import useHandleClosePopUp from "hooks/popUpModal/useHandleClosePopUp";
import useResetTabs from "hooks/useResetTabs";
import CommonTabBtn from "./Common/CommonTabBtn";
import { useContent } from "hooks/useContent";

export default function HeadButtonsNabewerking() {
  const { setSelectedTab } = useTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { dbPoints, setPoints } = usePointsStore();

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
                  graphicsLayer?.removeAll();
                  graphicsLayerHover?.removeAll();
                  redGraphicsLayer?.removeAll();
                  setPoints(dbPoints);
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
