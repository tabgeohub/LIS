/** Shared overlay/feature reset used by Step2 Vorige + Annuleren. */
export function runFinishedPlanStep2ExitCleanup(input: {
  clearOverlayLayers: () => void;
  resetFeatures: () => void;
  handleClear: () => void;
}): void {
  input.clearOverlayLayers();
  input.resetFeatures();
  input.handleClear();
}
