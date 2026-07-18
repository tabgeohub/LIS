const fieldClass =
  "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm";

export function EditUserTextField(props: {
  id: string;
  label: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  type?: string;
  disabled?: boolean;
}) {
  const stateCls = props.disabled
    ? "bg-gray-100 text-gray-500"
    : "focus:outline-none focus:ring-blue-500 focus:border-blue-500";
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">{props.label}</label>
      <input
        type={props.type ?? "text"}
        id={props.id}
        name={props.id}
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
        className={`${fieldClass} ${stateCls}`}
        placeholder={props.label}
      />
    </div>
  );
}
