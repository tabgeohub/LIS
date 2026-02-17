import { TbLine, TbPointFilled, TbPolygon } from "react-icons/tb";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useEffect, useRef, useState } from "react";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";

export default function DrawingTool() {
  const { mapView } = useMapViewState();
  const [selectedTool, setSelectedTool] = useState<"point" | "line" | "polygon" | null>(null);
  const sketchViewModelRef = useRef<SketchViewModel | null>(null);
  const graphicsLayerRef = useRef<GraphicsLayer | null>(null);

  // Cleanup function
  const cleanup = () => {
    if (sketchViewModelRef.current) {
      sketchViewModelRef.current.destroy();
      sketchViewModelRef.current = null;
    }
    if (graphicsLayerRef.current && mapView) {
      mapView.map.remove(graphicsLayerRef.current);
      graphicsLayerRef.current = null;
    }
    if (mapView?.container) {
      mapView.container.style.cursor = "";
    }
    setSelectedTool(null);
  };

  // Enables drawing on the map according to the tool selected
  function handleDrawingTool(tool: string) {
    if (!mapView) return;

    // If same tool clicked, cancel drawing
    if (selectedTool === tool) {
      cleanup();
      return;
    }

    // Cleanup previous drawing session
    cleanup();

    // Create graphics layer for drawing
    const graphicsLayer = new GraphicsLayer({
      title: "Drawing Layer",
      listMode: "hide",
    });
    mapView.map.add(graphicsLayer);
    graphicsLayerRef.current = graphicsLayer;

    // Create SketchViewModel
    const sketchViewModel = new SketchViewModel({
      view: mapView,
      layer: graphicsLayer,
      defaultCreateOptions: {
        mode: "click",
      },
    });

    sketchViewModelRef.current = sketchViewModel;

    if (mapView.container) {
      mapView.container.style.cursor = "crosshair";
    }

    // Handle geometry creation
    sketchViewModel.on("create", (event) => {
      if (event.state === "complete") {
        const geometry = event.graphic.geometry;
        
        // Apply appropriate symbol based on geometry type
        let symbol;
        if (tool === "point") {
          symbol = new SimpleMarkerSymbol({
            color: [226, 119, 40],
            outline: { color: [255, 255, 255], width: 2 },
            size: 12,
          });
        } else if (tool === "line") {
          symbol = new SimpleLineSymbol({
            color: [226, 119, 40],
            width: 3,
          });
        } else if (tool === "polygon") {
          symbol = new SimpleFillSymbol({
            color: [226, 119, 40, 0.3],
            outline: { color: [226, 119, 40], width: 2 },
          });
        }

        if (symbol) {
          event.graphic.symbol = symbol;
        }

        // Reset cursor after drawing is complete - keep drawing mode active
        // Don't reset cursor here if you want to continue drawing
        // The cursor will remain as crosshair for continued drawing

        // You can handle the completed geometry here
        // console.log("Drawing completed:", geometry);
        
        // Optionally, keep the drawing active or cleanup
        // cleanup(); // Uncomment to stop drawing after one shape
      }
    });

    // Start drawing based on tool type
    let geometryType:  "polyline" | "polygon";
 
     if (tool === "line") {
      geometryType = "polyline";
    } else if (tool === "polygon") {
      geometryType = "polygon";
    } else {
      return;
    }

    // Start drawing
    sketchViewModel.create(geometryType);
    
    setSelectedTool(tool);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div className="p-2">
      <p className="text-[14px] text-gray-700">
        You have to select the type of the drawing tool you want to use.
      </p>

      <div className="flex gap-x-2 mt-4">
        <button
          onClick={() => handleDrawingTool("line")}
          className={`gray-button flex items-center gap-x-2 ${
            selectedTool === "line" ? "bg-primary text-white" : ""
          }`}
        >
          <TbLine />
          <span>Line</span>
        </button>

        <button
          onClick={() => handleDrawingTool("polygon")}
          className={`gray-button flex items-center gap-x-2 ${
            selectedTool === "polygon" ? "bg-primary text-white" : ""
          }`}
        >
          <TbPolygon />
          <span>Polygon</span>
        </button>
      </div>

      {selectedTool && (
        <div className="mt-2 text-xs text-gray-600">
          Drawing mode: {selectedTool}. Click on the map to draw. Click the button again to cancel.

          {selectedTool === "polygon" || selectedTool === "line" && (
            <p className="mt-2 text-xs text-gray-600">
              Double click to finish drawing.
            </p>
          )}
        </div>
      )}
    </div>
  );
}