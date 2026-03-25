import { Geometry } from "hooks/features/useGeometriesStore";

export type GeometryEditDraft = {
  omschrijving: string;
  organisatie: string;
  activiteit: string;
  specifiek_letten_op: string;
  vertrouwelijk: boolean;
  herhalen: boolean;
};

export function geometryToDraft(g: Geometry): GeometryEditDraft {
  const spec =
    (g as { specifiek_letten_op?: string }).specifiek_letten_op ??
    (g as { specifiekLettenOp?: string }).specifiekLettenOp ??
    "";

  return {
    omschrijving: g.omschrijving ?? "",
    organisatie: g.organisatie != null ? String(g.organisatie) : "",
    activiteit: g.activiteit != null ? String(g.activiteit) : "",
    specifiek_letten_op: spec,
    vertrouwelijk: Boolean(
      g.vertrouwelijk === true || g.vertrouwelijk === 1
    ),
    herhalen: Boolean(g.herhalen === true || g.herhalen === 1),
  };
}
