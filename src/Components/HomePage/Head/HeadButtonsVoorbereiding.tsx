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

  const primaryPairTabs = voorbereidingTabs.slice(0, 2);
  const restVoorbereidingTabs = voorbereidingTabs.slice(2);

  const handleVoorbereidingTabClick = (item: (typeof voorbereidingTabs)[0]) => {
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
  };

  return (
    <div className="flex gap-x-1">
      <div className="flex flex-col justify-between rounded-sm border border-gray-200 bg-white px-3 py-[1px]">
        <div className="flex gap-[10px] pt-2">
          {primaryPairTabs.map((item) => (
            <CommonTabBtn
              key={item.id}
              item={item}
              onClick={() => handleVoorbereidingTabClick(item)}
            />
          ))}
        </div>

        <p className="mt-2 text-center text-[10px] tracking-normal text-gray-400">
          {content.voorbereiding.creatieBoxLabel}
        </p>
      </div>

      <div className="flex flex-col justify-between rounded-sm border border-gray-200 bg-white px-4 py-[1px]">
        <div className="flex gap-[10px] pt-2">
          {restVoorbereidingTabs.map((item) => (
            <CommonTabBtn
              key={item.id}
              item={item}
              onClick={() => handleVoorbereidingTabClick(item)}
            />
          ))}
        </div>

        <p className="mt-2 text-center text-[10px] tracking-normal text-gray-400">
          {content.voorbereiding.label}
        </p>
      </div>

      <FilterTabs />
    </div>
  );
}
