import ChevronButton from "../Common/ChevronButton";
import PopupModal from "../Common/PopupModal";
import FeatureLayerPopup from "../Common/FeatureLayerPopup";
import Bevragen from "../Left/Tools/Bevragen";
import HoveredPointPopup from "./HoveredPointPopup";
import { MapTopMessageBanner } from "./MapTopMessageBanner";
import { MapPathPointPopup } from "./MapPathPointPopup";
import type { useMapViewCompModel } from "./useMapViewCompModel";

type Model = ReturnType<typeof useMapViewCompModel>;

export function MapViewOverlays(model: Model) {
  return (
    <>
      <ChevronButton
        setOpenSideBar={model.setOpenSideBar}
        openSideBar={model.openSideBar}
      />
      <PopupModal />
      <FeatureLayerPopup />
      <Bevragen />
      <HoveredPointPopup />
      <MapTopMessageBanner
        topMessage={model.topMessage}
        setTopMessage={model.setTopMessage}
      />
      <MapPathPointPopup
        selectedPathPoint={model.selectedPathPoint}
        setSelectedPathPoint={model.setSelectedPathPoint}
      />
    </>
  );
}
