import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import useFeatureLayerPopup from "hooks/hover-click-handlers/useFeatureLayerPopup";
import { useEffect, useState } from "react";
import {
  buildPopupDisplayAttributes,
  resolvePopupPosition,
} from "./featureLayerPopupFormatting";

export default function FeatureLayerPopup() {
  const { popupData, closePopup } = useFeatureLayerPopup();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!popupData) return;

    setPosition(resolvePopupPosition(popupData.screenPoint));
  }, [popupData]);

  if (!popupData) {
    return null;
  }

  const displayAttributes = buildPopupDisplayAttributes(popupData.attributes);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="absolute z-[10000] bg-white rounded-lg shadow-xl min-w-[300px] max-w-[400px] max-h-[500px] overflow-hidden flex flex-col"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
          <h2 className="text-base font-semibold text-gray-800">
            {popupData.layerTitle}
          </h2>
          <button
            onClick={closePopup}
            className="hover:scale-110 transition-all text-gray-600 hover:text-gray-800"
          >
            <IoCloseOutline className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-3 flex-1">
          {displayAttributes.length === 0 ? (
            <p className="text-gray-500 text-sm">Geen attributen beschikbaar</p>
          ) : (
            <div className="space-y-2">
              {displayAttributes.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-3 py-1.5 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-xs font-medium text-gray-600">
                    {item.label}:
                  </span>
                  <span className="text-xs text-gray-800 break-words">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
