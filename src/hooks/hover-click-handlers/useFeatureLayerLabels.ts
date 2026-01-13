import { useEffect, useRef } from "react";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import Graphic from "@arcgis/core/Graphic";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

const TARGET_LAYER_TITLES = ["Strandpalen", "Damnummers"];

export default function useFeatureLayerLabels() {
  const { map, mapView } = useMapViewState();
  const labelsGraphicsLayerRef = useRef<__esri.GraphicsLayer | null>(null);
  const processedLayersRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!map || !mapView) return;

    if (!labelsGraphicsLayerRef.current) {
      const labelsLayer = new GraphicsLayer({
        title: "FeatureLayerLabels",
        visible: true,
      });

      map.add(labelsLayer);

      const layerIndex = map.layers.length - 1;

      map.reorder(labelsLayer, layerIndex);
      labelsGraphicsLayerRef.current = labelsLayer;
    }

    const updateLabels = async () => {
      if (!labelsGraphicsLayerRef.current) return;

      labelsGraphicsLayerRef.current.removeAll();
      processedLayersRef.current.clear();

      const targetLayers = map.layers
        .toArray()
        .filter(
          (layer): layer is __esri.FeatureLayer =>
            layer.type === "feature" &&
            layer.title !== null &&
            layer.title !== null &&
            layer.title !== undefined &&
            TARGET_LAYER_TITLES.includes(layer.title) &&
            layer.visible === true
        );

      for (const layer of targetLayers) {
        if (processedLayersRef.current.has(layer.title || "")) continue;

        try {
          if (!layer.loaded) {
            await layer.load();
          }

          await new Promise((resolve) => setTimeout(resolve, 500));

          const query = layer.createQuery();
          query.where = "1=1";
          query.outFields = ["*"];
          query.returnGeometry = true;

          const featureSet = await layer.queryFeatures(query);

          featureSet.features.forEach((feature) => {
            const geometry = feature.geometry as __esri.Point;
            if (!geometry) return;

            const attributes = feature.attributes;
            let labelText = "";

            if (layer.title === "Damnummers") {
              labelText = String(attributes.Damnr || attributes.damnr || "");
            } else if (layer.title === "Strandpalen") {
              labelText = String(
                attributes.OBJECTID ||
                  attributes.objectId ||
                  attributes.objectid ||
                  ""
              );
            }

            if (!labelText) return;

            const textSymbol = new TextSymbol({
              text: labelText,
              color: [0, 0, 0, 1],
              font: {
                size: 8,
                family: "Arial",
                weight: "bold",
              },
              haloColor: [255, 255, 255, 1],
              haloSize: 1,
              yoffset: 6,
            });

            const labelGraphic = new Graphic({
              geometry: geometry,
              symbol: textSymbol,
              attributes: {
                type: "feature-layer-label",
                layerTitle: layer.title,
              },
            });

            if (labelsGraphicsLayerRef.current) {
              labelsGraphicsLayerRef.current.add(labelGraphic);
            }
          });

          if (layer.title) {
            processedLayersRef.current.add(layer.title);
          }
        } catch (error) {
          console.error(`Error querying ${layer.title} for labels:`, error);
        }
      }
    };

    const watchHandle = map.layers.on("after-add", (event) => {
      const addedLayer = event.item;
      if (
        addedLayer.type === "feature" &&
        addedLayer.title &&
        TARGET_LAYER_TITLES.includes(addedLayer.title)
      ) {
        addedLayer.when(() => {
          setTimeout(() => {
            updateLabels();
          }, 1000);
        });
      } else {
        updateLabels();
      }
    });

    const removeHandle = map.layers.on("after-remove", () => {
      updateLabels();
    });

    const visibilityHandles: __esri.Handle[] = [];
    map.layers.forEach((layer) => {
      if (
        layer.type === "feature" &&
        layer.title &&
        TARGET_LAYER_TITLES.includes(layer.title)
      ) {
        const handle = layer.watch("visible", () => {
          updateLabels();
        });
        visibilityHandles.push(handle);
      }
    });

    updateLabels();

    return () => {
      watchHandle.remove();
      removeHandle.remove();
      visibilityHandles.forEach((handle) => handle.remove());
      if (labelsGraphicsLayerRef.current) {
        labelsGraphicsLayerRef.current.removeAll();
      }
    };
  }, [map, mapView]);
}
