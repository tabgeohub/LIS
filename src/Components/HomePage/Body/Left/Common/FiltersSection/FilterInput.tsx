export function FilterInput({
  label,
  value,
  setValue,
  required = false,
  type = "text",
  disabled = false,
  minToday = true,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  required?: boolean;
  type?: string;
  disabled?: boolean;
  minToday?: boolean;
}) {
  const today = minToday ? new Date().toISOString().split("T")[0] : "";

  return (
    <div className="grid grid-cols-6 gap-x-2 items-center">
      <p className="col-span-2 labelClass">
        {label}

        {required && <span className="text-gray-500"> *</span>}
      </p>

      {type === "text" && (
        <input
          disabled={disabled}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          className="inputClass !w-[75%] col-span-4"
        />
      )}

      {type === "date" && (
        <input
          disabled={disabled}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="date"
          min={today}
          className="inputClass !w-[75%] col-span-4"
        />
      )}

      {type === "number" && (
        <input
          disabled={disabled}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="number"
          className="inputClass !w-[75%] col-span-4"
        />
      )}
    </div>
  );
}
