import { createDashboardFormHandlers } from "./createDashboardFormHandlers";

/** Dashboard form handlers with selection-gated async submit. */
export function createDashboardSubmitHandlers<
  TForm extends Record<string, unknown>,
  TSelected,
>(input: {
  setFormData: React.Dispatch<React.SetStateAction<TForm>>;
  selected: TSelected | null;
  setLoading: (value: boolean) => void;
  submitSelected: (selected: TSelected) => Promise<void>;
  onAfterSuccess?: () => void;
}) {
  return createDashboardFormHandlers({
    setFormData: input.setFormData,
    hasSelection: Boolean(input.selected),
    setLoading: input.setLoading,
    submit: async () => {
      if (!input.selected) return;
      await input.submitSelected(input.selected);
      input.onAfterSuccess?.();
    },
  });
}
