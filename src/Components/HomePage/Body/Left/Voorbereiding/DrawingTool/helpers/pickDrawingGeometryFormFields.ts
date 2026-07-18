/** Shared geometry form fields used for create payload + point context. */
export function pickDrawingGeometryFormFields(store: {
  omschrijving: string;
  organisatie: string;
  vertrouwelijk: boolean;
  herhalen: boolean;
  activiteit: string;
  specifiekLettenOp: string;
}) {
  return {
    omschrijving: store.omschrijving,
    organisatie: store.organisatie,
    vertrouwelijk: store.vertrouwelijk,
    herhalen: store.herhalen,
    activiteit: store.activiteit,
    specifiekLettenOp: store.specifiekLettenOp,
  };
}
