function firstDefinedString(
  attributes: Record<string, unknown>,
  keys: string[]
): string {
  for (const key of keys) {
    const value = attributes[key];
    if (value != null && value !== "") return String(value);
  }
  return "";
}

const LABEL_RESOLVERS: Record<
  string,
  (attributes: Record<string, unknown>) => string
> = {
  Damnummers: (attributes) =>
    firstDefinedString(attributes, ["Damnr", "damnr"]),
  Strandpalen: (attributes) =>
    firstDefinedString(attributes, ["OBJECTID", "objectId", "objectid"]),
};

export function getFeatureLayerLabelText(
  layerTitle: string,
  attributes: Record<string, unknown>
): string {
  const resolve = LABEL_RESOLVERS[layerTitle];
  return resolve ? resolve(attributes) : "";
}
