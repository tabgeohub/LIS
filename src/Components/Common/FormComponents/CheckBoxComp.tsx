export default function CheckBoxComp({
  checked,
  value,
  setValue,
  label,
}: {
  checked: boolean;
  value: boolean;
  setValue: (value: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex gap-x-2 items-center">
      <input
        checked={checked}
        onChange={() => setValue(!value)}
        type="checkbox"
        className="h-4 w-4 cursor-pointer"
        id={label}
      />
      <label htmlFor={label} className="labelClass cursor-pointer">
        {label}
      </label>
    </div>
  );
}
