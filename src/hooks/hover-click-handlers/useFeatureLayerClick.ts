import { useEffect } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import {
  usePopUpState,
  FeatureLayerAttributes,
} from "@helpers/ZustandStates/popUpState";

const TARGET_LAYER_TITLES = ["Strandpalen", "Damnummers"];

export default function useFeatureLayerClick() {
  const { mapView } = useMapViewState();
  const {
    setFeatureLayerAttributes,
    setFeatureLayerTitle,
    setOpenFeatureLayerModal,
  } = usePopUpState();

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

          if (!layer.title) return;

          // Try to get objectId from various possible field names
          const objectId =
            attributes?.OBJECTID ||
            attributes?.objectId ||
            attributes?.objectid ||
            attributes?.FID ||
            attributes?.fid;

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
                setFeatureLayerAttributes(fullAttributes);
                setFeatureLayerTitle(layer.title);
                setOpenFeatureLayerModal(true);
              } else {
                // If query returns no results, use hitTest attributes
                setFeatureLayerAttributes(attributes);
                setFeatureLayerTitle(layer.title);
                setOpenFeatureLayerModal(true);
              }
            } catch (queryError) {
              console.error("Error querying FeatureLayer:", queryError);
              // Fallback to hitTest attributes if query fails
              setFeatureLayerAttributes(attributes);
              setFeatureLayerTitle(layer.title);
              setOpenFeatureLayerModal(true);
            }
          } else {
            // If no objectId found, use hitTest attributes
            setFeatureLayerAttributes(attributes);
            setFeatureLayerTitle(layer.title);
            setOpenFeatureLayerModal(true);
          }
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
  }, [
    mapView,
    setFeatureLayerAttributes,
    setFeatureLayerTitle,
    setOpenFeatureLayerModal,
  ]);
}
