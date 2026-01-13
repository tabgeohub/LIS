export function InputCompNum({
  label,
  value,
  setValue,
  required = false,
  type = "number",
  disabled = false,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
  required?: boolean;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-6 gap-x-2 items-center">
      <p className="col-span-2 labelClass">
        {label}

        {required && <span className="text-gray-500"> *</span>}
      </p>

      {type === "number" && (
        <input
          disabled={disabled}
          value={value || ""}
          onChange={(e) => setValue(Number(e.target.value))}
          type="number"
          className="inputClass col-span-4"
        />
      )}
    </div>
  );
}
