import { useEffect, useState, useRef, useCallback } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { FeatureLayerAttributes } from "@helpers/ZustandStates/popUpState";
import Graphic from "@arcgis/core/Graphic";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";

const TARGET_LAYER_TITLES = ["Strandpalen", "Damnummers"];

export type FeatureLayerPopupData = {
  attributes: FeatureLayerAttributes;
  layerTitle: string;
  screenPoint: { x: number; y: number };
  geometry: __esri.Point | null;
} | null;

export default function useFeatureLayerPopup() {
  const { mapView, redGraphicsLayer } = useMapViewState();
  const [popupData, setPopupData] = useState<FeatureLayerPopupData>(null);
  const markerGraphicRef = useRef<__esri.Graphic | null>(null);

  const clearMarker = useCallback(() => {
    if (markerGraphicRef.current && redGraphicsLayer) {
      redGraphicsLayer.remove(markerGraphicRef.current);
      markerGraphicRef.current = null;
    }
  }, [redGraphicsLayer]);

  const createMarker = useCallback(
    (geometry: __esri.Point) => {
      if (!redGraphicsLayer) return;

      // Clear previous marker first
      clearMarker();

      const markerSymbol = new SimpleMarkerSymbol({
        color: [0, 0, 0, 0], // Transparent fill
        size: 12,
        style: "circle",
        outline: {
          color: [255, 255, 255, 1],
          width: 2,
        },
      });

      const markerGraphic = new Graphic({
        geometry: geometry,
        symbol: markerSymbol,
        attributes: { type: "feature-layer-marker" },
      });

      redGraphicsLayer.add(markerGraphic);
      markerGraphicRef.current = markerGraphic;
    },
    [redGraphicsLayer, clearMarker]
  );

  useEffect(() => {
    if (!mapView) return;

    let isProcessing = false;
    let lastClickTime = 0;
    const DEBOUNCE_MS = 150;

    const clickHandler = mapView.on("click", async (event) => {
      // Debounce rapid clicks
      const now = Date.now();
      if (now - lastClickTime < DEBOUNCE_MS) {
        return;
      }
      lastClickTime = now;

      // Prevent multiple simultaneous clicks
      if (isProcessing) {
        return;
      }
      isProcessing = true;

      try {
        // Perform hitTest to check for clicked features
        const response = await mapView.hitTest(event);

        // Find features from target layers
        const targetFeature = response.results.find((result) => {
          const graphic = (result as __esri.GraphicHit).graphic;
          if (!graphic) return false;

          const layer = graphic.layer as __esri.FeatureLayer;
          if (!layer || !layer.title) return false;

          return TARGET_LAYER_TITLES.includes(layer.title);
        }) as __esri.GraphicHit | undefined;

        if (targetFeature && targetFeature.graphic) {
          const graphic = targetFeature.graphic;
          const layer = graphic.layer as __esri.FeatureLayer;
          const attributes = graphic.attributes as FeatureLayerAttributes;
          const geometry = graphic.geometry as __esri.Point;

          if (!layer.title || !geometry) return;

          // Clear previous marker
          if (markerGraphicRef.current && redGraphicsLayer) {
            redGraphicsLayer.remove(markerGraphicRef.current);
            markerGraphicRef.current = null;
          }

          // Try to get objectId from various possible field names
          const objectId =
            attributes?.OBJECTID ||
            attributes?.objectId ||
            attributes?.objectid ||
            attributes?.FID ||
            attributes?.fid;

          // Convert map point to screen coordinates
          const screenPoint = mapView.toScreen(event.mapPoint);

          if (!screenPoint) {
            return; // Cannot convert to screen coordinates
          }

          if (objectId) {
            try {
              // Query the FeatureLayer to get full attributes
              const query = layer.createQuery();
              query.objectIds = [objectId];
              query.returnGeometry = false;
              query.outFields = ["*"]; // Get all fields

              const featureSet = await layer.queryFeatures(query);

              if (featureSet.features.length > 0) {
                const fullAttributes = featureSet.features[0]
                  .attributes as FeatureLayerAttributes;
                setPopupData({
                  attributes: fullAttributes,
                  layerTitle: layer.title,
                  screenPoint: { x: screenPoint.x, y: screenPoint.y },
                  geometry: geometry,
                });
              } else {
                // If query returns no results, use hitTest attributes
                setPopupData({
                  attributes: attributes,
                  layerTitle: layer.title,
                  screenPoint: { x: screenPoint.x, y: screenPoint.y },
                  geometry: geometry,
                });
              }
              createMarker(geometry);
            } catch (queryError) {
              console.error("Error querying FeatureLayer:", queryError);
              // Fallback to hitTest attributes if query fails
              setPopupData({
                attributes: attributes,
                layerTitle: layer.title,
                screenPoint: { x: screenPoint.x, y: screenPoint.y },
                geometry: geometry,
              });
              createMarker(geometry);
            }
          } else {
            // If no objectId found, use hitTest attributes
            setPopupData({
              attributes: attributes,
              layerTitle: layer.title,
              screenPoint: { x: screenPoint.x, y: screenPoint.y },
              geometry: geometry,
            });
            createMarker(geometry);
          }
        } else {
          // Close popup if clicking on empty space
          clearMarker();
          setPopupData(null);
        }
      } catch (error) {
        console.error("Error handling FeatureLayer click:", error);
      } finally {
        isProcessing = false;
      }
    });

    return () => {
      clickHandler.remove();
    };
  }, [mapView, createMarker, clearMarker, redGraphicsLayer]);

  const closePopup = useCallback(() => {
    clearMarker();
    setPopupData(null);
  }, [clearMarker]);

  // Cleanup marker on unmount
  useEffect(() => {
    return () => {
      clearMarker();
    };
  }, [clearMarker]);

  return { popupData, closePopup };
}
