import { Geometry } from "hooks/features";

export type GeometryEditDraft = {
  omschrijving: string;
  organisatie: string;
  activiteit: string;
  specifiek_letten_op: string;
  vertrouwelijk: boolean;
  herhalen: boolean;
};

function stringOrEmpty(value: unknown): string {
  return value != null ? String(value) : "";
}

function geometrySpecField(g: Geometry): string {
  const withSnake = g as { specifiek_letten_op?: string };
  const withCamel = g as { specifiekLettenOp?: string };
  return withSnake.specifiek_letten_op ?? withCamel.specifiekLettenOp ?? "";
}

function flagTruthy(value: unknown): boolean {
  return Boolean(value === true || value === 1);
}

export function geometryToDraft(g: Geometry): GeometryEditDraft {
  return {
    omschrijving: stringOrEmpty(g.omschrijving),
    organisatie: stringOrEmpty(g.organisatie),
    activiteit: stringOrEmpty(g.activiteit),
    specifiek_letten_op: geometrySpecField(g),
    vertrouwelijk: flagTruthy(g.vertrouwelijk),
    herhalen: flagTruthy(g.herhalen),
  };
}
