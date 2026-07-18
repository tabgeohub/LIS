export const PATH_FEATURE_LAYER_FIELDS = [
  { name: "OBJECTID", type: "oid" as const },
  { name: "planId", type: "string" as const },
  { name: "vluchtnummer", type: "string" as const },
  { name: "latitude", type: "double" as const },
  { name: "longitude", type: "double" as const },
  { name: "altitude", type: "double" as const },
  { name: "speed", type: "double" as const },
  { name: "rotationAngle", type: "double" as const },
];

export const PATH_FEATURE_LAYER_RENDERER = {
  type: "simple" as const,
  symbol: {
    type: "simple-marker" as const,
    color: "red",
    size: 6,
    outline: { color: "black", width: 0.5 },
  },
};
