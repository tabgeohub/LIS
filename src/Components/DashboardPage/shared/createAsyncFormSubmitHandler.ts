/** Shared loading-gated form submit for dashboard EditUser / ResetPassword. */
export function createAsyncFormSubmitHandler(input: {
  hasSelection: boolean;
  setLoading: (value: boolean) => void;
  submit: () => Promise<void>;
}) {
  return async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.hasSelection) return;
    input.setLoading(true);
    try {
      await input.submit();
    } finally {
      input.setLoading(false);
    }
  };
}
