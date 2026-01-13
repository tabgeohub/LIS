import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import useFeatureLayerPopup from "hooks/hover-click-handlers/useFeatureLayerPopup";
import { useEffect, useState } from "react";

export default function FeatureLayerPopup() {
  const { popupData, closePopup } = useFeatureLayerPopup();
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!popupData) return;

    // Position popup to the right of the clicked point with some offset
    const offsetX = 20;
    const offsetY = -50; // Center vertically on the point

    setPosition({
      x: popupData.screenPoint.x + offsetX,
      y: popupData.screenPoint.y + offsetY,
    });
  }, [popupData]);

  if (!popupData) {
    return null;
  }

  // Filter out internal ArcGIS fields and format the attributes
  const displayAttributes = Object.entries(popupData.attributes)
    .filter(([key]) => {
      // Exclude internal ArcGIS fields and metadata fields
      const lowerKey = key.toLowerCase();
      return (
        !key.startsWith("OBJECTID") &&
        key !== "FID" &&
        key !== "Shape" &&
        key !== "Shape_Length" &&
        key !== "Shape_Area" &&
        lowerKey !== "globalid" &&
        lowerKey !== "global_id" &&
        lowerKey !== "created_user" &&
        lowerKey !== "created_user" &&
        lowerKey !== "created_date" &&
        lowerKey !== "createddate" &&
        lowerKey !== "last_edited_user" &&
        lowerKey !== "lastediteduser" &&
        lowerKey !== "last_edited_date" &&
        lowerKey !== "lastediteddate"
      );
    })
    .map(([key, value]) => ({
      label: formatFieldName(key),
      value: formatValue(value),
    }))
    .filter((item) => item.value !== null && item.value !== undefined);

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

// Helper function to format field names (convert snake_case to Title Case)
function formatFieldName(key: string): string {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Helper function to format values
function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "boolean") {
    return value ? "Ja" : "Nee";
  }

  if (typeof value === "number") {
    // Check if it's a date (timestamp)
    if (value > 1000000000000) {
      // Likely a timestamp in milliseconds
      try {
        return new Date(value).toLocaleString("nl-NL");
      } catch {
        return value.toString();
      }
    }
    return value.toString();
  }

  if (typeof value === "string") {
    // Check if it's a date string
    if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
      try {
        return new Date(value).toLocaleString("nl-NL");
      } catch {
        return value;
      }
    }
    return value;
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}
