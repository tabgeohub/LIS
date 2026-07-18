import type { useDeletePointStep1FormModel } from "./useDeletePointStep1FormModel";

type Model = ReturnType<typeof useDeletePointStep1FormModel>;

export function deletePointStep1FieldProps(m: Model) {
  return {
    className: "!space-y-3",
    hideVertrouwelijk: true as const,
    vertrouwelijk: m.vertrouwelijk === 1,
    setVertrouwelijk: (value: boolean) => m.setVertrouwelijk(value ? 1 : 0),
    herhalen: m.herhalen,
    setHerhalen: m.setHerhalen,
    activiteit: m.activiteit_id,
    setActiviteit: m.setActiviteit_id,
    organisatie: m.organisatie_id,
    setOrganisatie: m.setOrganisatie_id,
    specifiekLettenOp: m.specifiek_letten_op,
    setSpecifiekLettenOp: m.setSpecifiek_letten_op,
    labels: {
      herhalen: m.labels.herhalen,
      activiteit: m.labels.activiteit,
      organisatie: m.labels.organisatie,
      specifiekLettenOp: m.labels.specifiekLettenOp,
    },
  };
}
