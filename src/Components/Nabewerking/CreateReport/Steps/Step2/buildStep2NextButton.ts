import type { useStep2ButtonsModel } from "./useStep2ButtonsModel";

type Model = ReturnType<typeof useStep2ButtonsModel>;

export function buildStep2NextButton(model: Model) {
  const { withLog, labels, report, handleStep2 } = model;
  return {
    label: labels.volgende,
    onClick: withLog("User clicked 'Next' button", () => {
      model.graphicsLayerHover?.removeAll();
      model.graphicsLayer?.removeAll();
      model.setHoveredPoints(null);
      report.setStep(3);
      handleStep2();
    }),
  };
}
