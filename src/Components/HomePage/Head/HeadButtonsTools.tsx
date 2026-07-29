import { useTabState } from "hooks/zustand/ui/tabState";
import { useOpeSideBarState } from "hooks/zustand/ui/openSideBar";
import { toolsTabs } from "./constants";
import FilterTabs from "./Common/FilterTabs";
import { useMapViewState } from "hooks/zustand/ui/mapViewState";
import { useState } from "react";
import Exporter from "../Body/Left/Tools/Exporter";
import Uploaden from "../Body/Left/Tools/Uploaden";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import useHandleClosePopUp from "Components/HomePage/hooks/popUpModal/useHandleClosePopUp";
import useResetTabs from "Components/HomePage/hooks/tabs/useResetTabs";
import CommonTabBtn from "./Common/CommonTabBtn";
import { useContent } from "hooks/useContent";
import { handleToolsTabClick } from "./handleToolsTabClick";

export default function HeadButtonsTools() {
  const { setSelectedTab, setOpenBevragen } = useTabState();
  const { setOpenSideBar } = useOpeSideBarState();
  const { mapView, graphicsLayer, graphicsLayerHover, redGraphicsLayer } =
    useMapViewState();
  const { resetFeatures } = useResetFeatures();
  const [openExporter, setOpenExporter] = useState(false);
  const [openUploader, setOpenUploader] = useState(false);
  const handleClose = useHandleClosePopUp();
  const reset = useResetTabs();
  const content = useContent();

  return (
    <div className="flex gap-x-1">
      <div className="border-gray-200 border-[1px] px-4 py-[1px] bg-white rounded-sm flex flex-col justify-between">
        <div className="flex gap-[10px] pt-2">
          {toolsTabs.map((item) => (
            <CommonTabBtn
              onClick={() => {
                handleClose();
                reset();
                handleToolsTabClick({
                  item,
                  mapView,
                  graphicsLayer,
                  graphicsLayerHover,
                  redGraphicsLayer,
                  resetFeatures,
                  setOpenExporter,
                  setOpenUploader,
                  setOpenBevragen,
                  setSelectedTab,
                  setOpenSideBar,
                });
              }}
              item={item}
            />
          ))}
        </div>

        <p className="text-[10px] text-gray-400 tracking-normal text-center mt-2">
          {content.tools.label}
        </p>
      </div>

      <FilterTabs />
      <Uploaden openUploader={openUploader} setOpenUploader={setOpenUploader} />
      <Exporter openExporter={openExporter} setOpenExporter={setOpenExporter} />
    </div>
  );
}
