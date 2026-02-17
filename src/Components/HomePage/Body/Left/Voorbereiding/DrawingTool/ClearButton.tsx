import { motion } from "framer-motion";
import { TbTrash } from "react-icons/tb";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { classNames } from "@helpers/classNames";

interface ClearButtonProps {
  graphicsLayer: GraphicsLayer | null;
}

export default function ClearButton({ graphicsLayer }: ClearButtonProps) {
  const handleClear = () => {
    if (graphicsLayer) {
      graphicsLayer.removeAll();
    }
  };

  const hasGraphics = graphicsLayer && graphicsLayer.graphics.length > 0;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClear}
      disabled={!hasGraphics}
      className={classNames(
        "flex items-center justify-center gap-1.5",
        "px-3 py-1.5 rounded-lg",
        "text-xs font-semibold",
        "transition-all duration-200",
        hasGraphics
          ? "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg cursor-pointer"
          : "bg-gray-200 text-gray-400 cursor-not-allowed"
      )}
      title={hasGraphics ? "Alle tekeningen wissen" : "Geen tekeningen om te wissen"}
    >
      <TbTrash className="h-3.5 w-3.5" />
      <span>Alles wissen</span>
    </motion.button>
  );
}
