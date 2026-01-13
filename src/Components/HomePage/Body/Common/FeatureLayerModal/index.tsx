import { motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";

export default function FeatureLayerModal() {
  const {
    openFeatureLayerModal,
    setOpenFeatureLayerModal,
    featureLayerAttributes,
    featureLayerTitle,
  } = usePopUpState();

  if (!openFeatureLayerModal || !featureLayerAttributes) {
    return null;
  }

  // Filter out internal ArcGIS fields and format the attributes
  const displayAttributes = Object.entries(featureLayerAttributes)
    .filter(([key]) => {
      // Exclude internal ArcGIS fields
      return (
        !key.startsWith("OBJECTID") &&
        key !== "FID" &&
        key !== "Shape" &&
        key !== "Shape_Length" &&
        key !== "Shape_Area"
      );
    })
    .map(([key, value]) => ({
      label: formatFieldName(key),
      value: formatValue(value),
    }))
    .filter((item) => item.value !== null && item.value !== undefined);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => setOpenFeatureLayerModal(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            {featureLayerTitle}
          </h2>
          <button
            onClick={() => setOpenFeatureLayerModal(false)}
            className="hover:scale-110 transition-all text-gray-600 hover:text-gray-800"
          >
            <IoCloseOutline className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 flex-1">
          {displayAttributes.length === 0 ? (
            <p className="text-gray-500 text-sm">Geen attributen beschikbaar</p>
          ) : (
            <div className="space-y-3">
              {displayAttributes.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-sm font-medium text-gray-600">
                    {item.label}:
                  </span>
                  <span className="text-sm text-gray-800 break-words">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
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

