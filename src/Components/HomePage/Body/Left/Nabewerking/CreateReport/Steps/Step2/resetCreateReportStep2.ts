import type { useStep2ButtonsModel } from "./useStep2ButtonsModel";

type Model = ReturnType<typeof useStep2ButtonsModel>;

export function resetCreateReportStep2(model: Model) {
  model.graphicsLayerHover?.removeAll();
  model.graphicsLayer?.removeAll();
  model.setHoveredPoints(null);
  model.geometriesGraphicsLayer?.removeAll();
  model.resetFeatures();
  model.report.setSelectedPoints([]);
  model.report.setSelectedGeometries([]);
  model.report.setZipFile(null);
  model.report.setZippingStatus("");
  model.report.setFilteredPlans([]);
  model.report.setFilterTerm("");
  model.report.clear();
}
