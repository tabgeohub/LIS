import { motion } from "framer-motion";
import { TbCheck } from "react-icons/tb";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { classNames } from "@helpers/classNames";
import Polyline from "@arcgis/core/geometry/Polyline";
import Polygon from "@arcgis/core/geometry/Polygon";
import { useDrawingStore } from "hooks/zustand/useDrawingStore";

interface ConfirmButtonProps {
  graphicsLayer: GraphicsLayer | null;
  hasGraphics: boolean;
}

export default function ConfirmButton({
  graphicsLayer,
  hasGraphics,
}: ConfirmButtonProps) {
  const { setStep, setGraphicsDrawn } = useDrawingStore();

  const handleConfirm = () => {
    if (!graphicsLayer) return;

    const graphics = graphicsLayer.graphics;
    const allPoints: Array<{ type: string; points: number[][] }> = [];

    graphics.forEach((graphic) => {
      const geometry = graphic.geometry;
      if (!geometry) return;

      if (geometry.type === "polyline") {
        const polyline = geometry as Polyline;
        // Polyline has paths - array of paths, each path is array of [longitude, latitude]
        polyline.paths.forEach((path, pathIndex) => {
          const points = path.map((coord) => [coord[0], coord[1]]);
          allPoints.push({
            type: "line",
            points: points,
          });
        });
      } else if (geometry.type === "polygon") {
        const polygon = geometry as Polygon;
        // Polygon has rings - array of rings, each ring is array of [longitude, latitude]
        polygon.rings.forEach((ring, ringIndex) => {
          const points = ring.map((coord) => [coord[0], coord[1]]);
          allPoints.push({
            type: "polygon",
            points: points,
          });
        });
      }
    });

    setGraphicsDrawn(allPoints);
    setStep(2);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleConfirm}
      disabled={!hasGraphics}
      className={classNames(
        "flex items-center justify-center gap-1.5",
        "px-3 py-2 rounded",
        "text-xs font-semibold",
        "transition-all duration-200",
        hasGraphics
          ? "bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg cursor-pointer"
          : "bg-gray-200 text-gray-400 cursor-not-allowed"
      )}
      title={hasGraphics ? "Tekeningen opslaan" : "Geen tekeningen om op te slaan"}
    >
      <TbCheck className="h-3.5 w-3.5" />
      <span>Opslaan</span>
    </motion.button>
  );
}
