export default function FilterSelect({
  label,
  value,
  setValue,
  options,
  required = false,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  options: { label: string; value: string }[];
  required?: boolean;
}) {
  return (
    <div className="grid grid-cols-6 gap-x-2 items-center">
      <p className="col-span-2 labelClass">
        {label} {required && <span className="text-gray-500"> *</span>}
      </p>
      <select
        className={`col-span-4 inputClass cursor-pointer ${
          value === "" ? "text-gray-300" : "text-black font-semibold"
        } `}
        name=""
        id=""
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {options.map((option) => (
          <option
            key={option.value}
            className="cursor-pointer"
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
