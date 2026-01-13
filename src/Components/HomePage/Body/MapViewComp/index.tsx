import { useOpeSideBarState } from "@helpers/ZustandStates/openSideBar";
import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useOpenAllTable } from "@helpers/ZustandStates/showAllTable";
import { motion } from "framer-motion";
import ChevronButton from "../Common/ChevronButton";
import PopupModal from "../Common/PopupModal";
import FeatureLayerPopup from "../Common/FeatureLayerPopup";
import Bottom from "../Bottom";
import MapComp from "./MapComp";
import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import Bevragen from "../Left/Tools/Bevragen";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { IoCloseOutline } from "react-icons/io5";
import HoveredPointPopup from "./HoveredPointPopup";
import {
  PathPointType,
  usePathPointState,
} from "@helpers/ZustandStates/pathPointState";
import useFeatureLayerLabels from "hooks/hover-click-handlers/useFeatureLayerLabels";

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

  // Add labels to FeatureLayers (Strandpalen, Damnummers)
  useFeatureLayerLabels();

  // -------- Resizable bottom panel state (in vh) --------
  // Default to 90vh if "open all table", else 55vh like before.
  const [panelVh, setPanelVh] = useState<number>(openAllTable ? 90 : 55);

  // Sync when openAllTable toggles
  useEffect(() => {
    setPanelVh(openAllTable ? 90 : 55);
  }, [openAllTable]);

  // Clamp helper
  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(max, v));

  const dragRef = useRef({
    dragging: false,
    startY: 0,
    startVh: 0,
  });

  // Mouse handlers for the resize bar
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    dragRef.current.dragging = true;
    dragRef.current.startY = e.clientY;
    dragRef.current.startVh = panelVh;
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current.dragging) return;

      const deltaY = e.clientY - dragRef.current.startY; // px moved
      const deltaVh = (deltaY / window.innerHeight) * 100;

      // 🔄 invert direction: dragging UP (deltaY negative) should INCREASE height
      const next = clamp(dragRef.current.startVh - deltaVh, 20, 90);
      setPanelVh(next);
    };

    const onUp = () => {
      if (!dragRef.current.dragging) return;
      dragRef.current.dragging = false;
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  // Keep track of bottom container size for child components
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

  // Map section height depends on whether the bottom panel is open
  const mapSectionHeight = useMemo(() => {
    if (!openTable) return "90vh"; // your original full map height
    // When table is open, the map takes the remaining height
    return `calc(100vh - ${panelVh}vh)`;
  }, [openTable, panelVh]);

  return (
    <motion.div
      variants={{
        visible: { width: "100vw", transition: { duration: 0.5 } },
        semiVisible: { width: "60vw", transition: { duration: 0.5 } },
      }}
      initial="semiVisible"
      animate="visible"
      exit="semiVisible"
      className="relative"
    >
      {/* ---------------- TOP (Map) ---------------- */}
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

        {/* Floating path point detail card */}
        {selectedPathPoint && (
          <PopupDetails
            selectedPathPoint={selectedPathPoint}
            onClose={() => setSelectedPathPoint(null)}
          />
        )}

        {/* ---- Resize handle: only show when the bottom panel is open ---- */}
        {openTable && (
          <div
            onMouseDown={onMouseDown}
            className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-gradient-to-b from-transparent to-gray-200"
            title="Sleep om de hoogte van het paneel aan te passen"
          />
        )}
      </div>

      {/* ---------------- BOTTOM (Resizable Panel) ---------------- */}
      {openTable && (
        <div
          ref={bottomContainerRef}
          className="bg-white"
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
