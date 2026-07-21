import { createFormFieldChangeHandler } from "./createFormFieldChangeHandler";
import { createAsyncFormSubmitHandler } from "./createAsyncFormSubmitHandler";

/** Shared onChange + loading-gated onSubmit for dashboard forms. */
export function createDashboardFormHandlers<T extends Record<string, unknown>>(input: {
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  hasSelection: boolean;
  setLoading: (value: boolean) => void;
  submit: () => Promise<void>;
}) {
  return {
    onChange: createFormFieldChangeHandler(input.setFormData),
    onSubmit: createAsyncFormSubmitHandler({
      hasSelection: input.hasSelection,
      setLoading: input.setLoading,
      submit: input.submit,
    }),
  };
}
