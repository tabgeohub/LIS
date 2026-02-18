import { useTabState } from "@helpers/ZustandStates/tabState";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { voorbereidingTabs } from "./constants";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import FilterTabs from "./Common/FilterTabs";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import useHandleClosePopUp from "hooks/popUpModal/useHandleClosePopUp";
import useResetTabs from "hooks/useResetTabs";
import CommonTabBtn from "./Common/CommonTabBtn";
import { useContent } from "hooks/useContent";

export default function HeadButtonsVoorbereiding() {
  const { setSelectedTab } = useTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { user } = useAuth();
  const { resetFeatures } = useResetFeatures();
  const { graphicsLayer, graphicsLayerHover, redGraphicsLayer } =
    useMapViewState();
  const handleClose = useHandleClosePopUp();

  const reset = useResetTabs();

  const content = useContent();

  return (
    <div className="flex gap-x-1">
      <div className="border-gray-200 border-[1px] px-4 py-[1px] bg-white rounded-sm flex flex-col justify-between">
        <div className="flex gap-[10px] pt-2">
          {voorbereidingTabs.map((item, index) => (
            <CommonTabBtn
              key={index}
              item={item}
              onClick={() => {
                if (!item.disabled && user.user_id !== 0) {
                  reset();
                  handleClose();
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
          {content.voorbereiding.label}
        </p>
      </div>

      <FilterTabs />
    </div>
  );
}
