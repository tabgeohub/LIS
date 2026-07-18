const LABEL_RESOLVERS: Record<
  string,
  (attributes: Record<string, unknown>) => string
> = {
  Damnummers: (attributes) =>
    String(attributes.Damnr || attributes.damnr || ""),
  Strandpalen: (attributes) =>
    String(
      attributes.OBJECTID ||
        attributes.objectId ||
        attributes.objectid ||
        ""
    ),
};

export function getFeatureLayerLabelText(
  layerTitle: string,
  attributes: Record<string, unknown>
): string {
  const resolve = LABEL_RESOLVERS[layerTitle];
  return resolve ? resolve(attributes) : "";
}
