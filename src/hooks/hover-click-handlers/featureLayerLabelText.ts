export function getFeatureLayerLabelText(
  layerTitle: string,
  attributes: Record<string, unknown>
): string {
  if (layerTitle === "Damnummers") {
    return String(attributes.Damnr || attributes.damnr || "");
  }

  if (layerTitle === "Strandpalen") {
    return String(
      attributes.OBJECTID ||
        attributes.objectId ||
        attributes.objectid ||
        ""
    );
  }

  return "";
}
