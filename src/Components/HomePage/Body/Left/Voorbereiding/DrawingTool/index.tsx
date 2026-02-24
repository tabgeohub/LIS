import { useEffect } from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import { useDrawingStore } from "hooks/zustand/useDrawingStore";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

export default function DrawingTool() {
    const { step, setStep, clear } = useDrawingStore();
    const { mapView } = useMapViewState();
    const { selectedTab } = useTabState();

    // Clear graphics, reset cursor, and reset step when component unmounts or when tab changes away from tekengereedschap
    useEffect(() => {
        const clearCurrentlyDrawingGraphics = () => {
            if (!mapView) return;

            // Search all graphics layers for graphics with "currently-drawing" attribute
            const layers = mapView.map.layers;
            for (let i = 0; i < layers.length; i++) {
                const layer = layers.getItemAt(i);
                if (layer instanceof GraphicsLayer) {
                    const graphics = layer.graphics.toArray();
                    graphics.forEach((graphic) => {
                        if (graphic.attributes && graphic.attributes["currently-drawing"] === true) {
                            try {
                                layer.remove(graphic);
                            } catch (err) {
                                // Ignore removal errors
                            }
                        }
                    });
                }
            }
        };

        const resetCursor = () => {
            if (mapView?.container) {
                mapView.container.style.cursor = "";
            }
        };

        // Clear graphics, reset cursor, clear store, and reset step if tab is not tekengereedschap
        if (selectedTab !== "tekengereedschap") {
            clearCurrentlyDrawingGraphics();
            resetCursor();
            clear(); // Clear the store (graphicsDrawn, form fields, etc.)
            setStep(1);
        }

        // Cleanup on unmount
        return () => {
            clearCurrentlyDrawingGraphics();
            resetCursor();
            clear(); // Clear the store
            setStep(1);
        };
    }, [mapView, selectedTab, setStep, clear]);

    return (
        <div>
            {step === 1 && <Step1 />}

            {step === 2 && <Step2 />}
        </div>
    );
}
