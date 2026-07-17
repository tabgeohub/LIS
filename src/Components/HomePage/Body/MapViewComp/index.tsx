import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useOpenAllTable } from "@helpers/ZustandStates/showAllTable";
import { motion } from "framer-motion";
import ChevronButton from "../Common/ChevronButton";
import PopupModal from "../Common/PopupModal";
import FeatureLayerPopup from "../Common/FeatureLayerPopup";
import Bottom from "../Bottom";
import MapComp from "./MapComp";
import { RefObject, useEffect, useRef, useState } from "react";
import Bevragen from "../Left/Tools/Bevragen";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { IoCloseOutline } from "react-icons/io5";
import HoveredPointPopup from "./HoveredPointPopup";
import {
  PathPointType,
  usePathPointState,
} from "@helpers/ZustandStates/pathPointState";
import useFeatureLayerLabels from "hooks/hover-click-handlers/useFeatureLayerLabels";
import useMapSectionHeight from "./useMapSectionHeight";
import {
  attachBottomPanelResizeListeners,
  beginBottomPanelDrag,
  type BottomPanelDragState,
} from "./bottomPanelResize";

export default function MapViewComp({
  mapDiv,
  vluchtnummer,
}: {
  mapDiv: RefObject<HTMLDivElement>;
  vluchtnummer: string;
}) {
  const { openSideBar, setOpenSideBar } = useOpeSideBarState();
  const { openTable } = useOpenTable();
  const { topMessage, setTopMessage } = useMapViewState();
  const { openAllTable } = useOpenAllTable();
  const { selectedPathPoint, setSelectedPathPoint } = usePathPointState();
  const bottomContainerRef = useRef<HTMLDivElement | null>(null);
  const [bottomDimensions, setBottomDimensions] = useState({
    width: 0,
    height: 0,
  });

  useFeatureLayerLabels();

  const [panelVh, setPanelVh] = useState<number>(openAllTable ? 90 : 55);

  useEffect(() => {
    setPanelVh(openAllTable ? 90 : 55);
  }, [openAllTable]);

  const { containerRef, mapSectionHeight } = useMapSectionHeight({
    openTable,
    panelVh,
  });

  const dragRef = useRef<BottomPanelDragState>({
    dragging: false,
    startY: 0,
    startVh: 0,
  });

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    beginBottomPanelDrag({
      dragRef,
      clientY: e.clientY,
      panelVh,
    });
  };

  useEffect(
    () =>
      attachBottomPanelResizeListeners({
        dragRef,
        setPanelVh,
      }),
    []
  );

  useEffect(() => {
    if (!openTable) {
      setBottomDimensions({ width: 0, height: 0 });
      return;
    }

    const element = bottomContainerRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      setBottomDimensions({ width, height });
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [openTable, panelVh]);

  return (
    <motion.div
      ref={containerRef}
      variants={{
        visible: { width: "100%", transition: { duration: 0.5 } },
        semiVisible: { width: "60%", transition: { duration: 0.5 } },
      }}
      initial="semiVisible"
      animate="visible"
      exit="semiVisible"
      className="relative h-full min-w-0 flex-1 overflow-hidden flex flex-col"
    >
      <div
        className="bg-gray-100 overflow-hidden relative"
        style={{ height: mapSectionHeight }}
      >
        <MapComp mapDiv={mapDiv} />

        <ChevronButton
          setOpenSideBar={setOpenSideBar}
          openSideBar={openSideBar}
        />

        <PopupModal />
        <FeatureLayerPopup />
        <Bevragen />
        <HoveredPointPopup />

        {topMessage.show && (
          <div className="absolute z-[10000] text-[12px] py-1.5 flex items-center justify-center gap-x-2 top-0 left-0 w-full bg-yellow-100">
            <p className="grid grid-cols-2">{topMessage.message}</p>
            <button
              onClick={() => setTopMessage({ message: "", show: false })}
              className="hover:scale-110 transition-all"
            >
              <IoCloseOutline />
            </button>
          </div>
        )}

        {selectedPathPoint && (
          <PopupDetails
            selectedPathPoint={selectedPathPoint}
            onClose={() => setSelectedPathPoint(null)}
          />
        )}

        {openTable && (
          <div
            onMouseDown={onMouseDown}
            className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-gradient-to-b from-transparent to-gray-200"
            title="Sleep om de hoogte van het paneel aan te passen"
          />
        )}
      </div>

      {openTable && (
        <div
          ref={bottomContainerRef}
          className="bg-white w-full min-w-0 shrink-0 overflow-hidden flex flex-col"
          style={{ height: `${panelVh}vh` }}
        >
          <Bottom
            vluchtnummer={vluchtnummer}
            containerHeight={bottomDimensions.height}
            containerWidth={bottomDimensions.width}
          />
        </div>
      )}
    </motion.div>
  );
}

function PopupDetails({
  selectedPathPoint,
  onClose,
}: {
  selectedPathPoint: PathPointType;
  onClose: () => void;
}) {
  if (!selectedPathPoint) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ duration: 0.5 }}
      className="absolute top-4 right-4 bg-gray-100 p-4 rounded-lg shadow-lg min-w-[220px] z-50"
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold text-[15px] text-gray-700">
          Padpuntdetails
        </p>
        <button onClick={onClose} className="hover:scale-110 transition-all">
          <IoCloseOutline className="text-gray-700" />
        </button>
      </div>

      <div className="mt-2">
        <p className="grid grid-cols-2">
          <span className="text-[12px] text-gray-600">Vluchtnummer:</span>
          <span className="font-semibold text-gray-700 text-[13px]">
            {selectedPathPoint.vluchtnummer}
          </span>
        </p>
        <p className="grid grid-cols-2">
          <span className="text-[12px] text-gray-600">Breedtegraad:</span>
          <span className="font-semibold text-gray-700 text-[13px]">
            {selectedPathPoint.latitude.toFixed(4)}
          </span>
        </p>
        <p className="grid grid-cols-2">
          <span className="text-[12px] text-gray-600">Lengtegraad:</span>
          <span className="font-semibold text-gray-700 text-[13px]">
            {selectedPathPoint.longitude.toFixed(4)}
          </span>
        </p>
        <p className="grid grid-cols-2">
          <span className="text-[12px] text-gray-600">Hoogte:</span>
          <span className="font-semibold text-gray-700 text-[13px]">
            {selectedPathPoint.altitude.toFixed(4)} m
          </span>
        </p>
        <p className="grid grid-cols-2">
          <span className="text-[12px] text-gray-600">Snelheid:</span>
          <span className="font-semibold text-gray-700 text-[13px]">
            {selectedPathPoint.speed.toFixed(4)} u
          </span>
        </p>
        <p className="grid grid-cols-2">
          <span className="text-[12px] text-gray-600">Rotatiehoek:</span>
          <span className="font-semibold text-gray-700 text-[13px]">
            {selectedPathPoint.rotationAngle.toFixed(4)}°
          </span>
        </p>
      </div>
    </motion.div>
  );
}
