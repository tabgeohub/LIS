import Map from "@arcgis/core/Map";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

export function createMapGraphicsLayers() {
  return {
    graphicsLayer: new GraphicsLayer(),
    graphicsLayerHover: new GraphicsLayer(),
    pointsGraphicsLayer: new GraphicsLayer({ title: "Aandachtspunten" }),
    yellowGraphicsLayer: new GraphicsLayer(),
    yellowGeometriesGraphicsLayer: new GraphicsLayer(),
    redGraphicsLayer: new GraphicsLayer(),
    selectedPointGraphicsLayer: new GraphicsLayer(),
    geometriesGraphicsLayer: new GraphicsLayer({ title: "Geometries" }),
  };
}

export function addAndOrderMapGraphicsLayers(input: {
  map: Map;
  layers: ReturnType<typeof createMapGraphicsLayers>;
}) {
  const {
    pointsGraphicsLayer,
    yellowGraphicsLayer,
    yellowGeometriesGraphicsLayer,
    graphicsLayer,
    geometriesGraphicsLayer,
    graphicsLayerHover,
    redGraphicsLayer,
    selectedPointGraphicsLayer,
  } = input.layers;

  const overlayOrder = [
    graphicsLayerHover,
    yellowGraphicsLayer,
    yellowGeometriesGraphicsLayer,
    redGraphicsLayer,
    graphicsLayer,
    geometriesGraphicsLayer,
    selectedPointGraphicsLayer,
  ];

  input.map.addMany([pointsGraphicsLayer, ...overlayOrder]);
  overlayOrder.forEach((layer, offset) =>
    input.map.layers.reorder(layer, input.map.layers.length - 1 - offset)
  );
}
