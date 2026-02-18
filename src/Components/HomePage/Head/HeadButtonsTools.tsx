import { useTabState } from "@helpers/ZustandStates/tabState";
import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { toolsTabs } from "./constants";
import FilterTabs from "./Common/FilterTabs";
import { ToolsTabsType } from "Types";
import { IconType } from "react-icons";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useState } from "react";
import Exporter from "../Body/Left/Tools/Exporter";
import Uploaden from "../Body/Left/Tools/Uploaden";
import { useResetFeatures } from "hooks/features/useResetFeatures";
import useHandleClosePopUp from "hooks/popUpModal/useHandleClosePopUp";
import useResetTabs from "hooks/useResetTabs";
import CommonTabBtn from "./Common/CommonTabBtn";
import { useContent } from "hooks/useContent";

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

  function handleClickTab(item: {
    id: ToolsTabsType;
    label: string;
    icon: IconType;
    disabled: boolean;
  }) {
    if (!item.disabled) {
      if (item.id === "startgebied") {
        let opts = {
          duration: 2000,
        };

        resetFeatures();
        // Remove all graphics except geometries
        if (graphicsLayer) {
          const graphicsToRemove = graphicsLayer.graphics.filter(
            (g) => g.attributes?.type !== "geometry"
          );
          graphicsToRemove.forEach((g) => graphicsLayer.remove(g));
        }
        graphicsLayerHover?.removeAll();
        redGraphicsLayer?.removeAll();

        mapView?.goTo(
          {
            target: [4.9041, 52.3676],
            zoom: 7,
          },
          opts
        );
      } else if (item.id === "exporteer") {
        setOpenExporter(true);
      } else if (item.id === "uploaden") {
        setOpenUploader(true);
      } else if (item.id === "bevragen") {
        setOpenBevragen(true);
      } else {
        setSelectedTab(item.id);
        setOpenSideBar(true);
        resetFeatures();
        // Remove all graphics except geometries
        if (graphicsLayer) {
          const graphicsToRemove = graphicsLayer.graphics.filter(
            (g) => g.attributes?.type !== "geometry"
          );
          graphicsToRemove.forEach((g) => graphicsLayer.remove(g));
        }
        redGraphicsLayer?.removeAll();
        graphicsLayerHover?.removeAll();
      }

      if (item.id !== "bevragen") {
        setOpenBevragen(false);
      }
    }
  }

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
                handleClickTab(item);
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
