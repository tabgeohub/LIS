/** Shared field-change handler for dashboard forms. */
export function createFormFieldChangeHandler<T extends Record<string, unknown>>(
  setFormData: React.Dispatch<React.SetStateAction<T>>
) {
  return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
}
