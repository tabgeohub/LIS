import { Field } from "formik";

export default function SelectFormik({
  label,
  name,
  required = false,
  options,
}: {
  label: string;
  name: string;
  required?: boolean;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="grid grid-cols-6 gap-x-2 items-center">
      <label className="col-span-2 labelClass" htmlFor={name}>
        {label}
      </label>

      <div className="col-span-4">
        <Field
          name={name}
          as="select"
          required={required}
          placeholder={label}
          className="inputClass"
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
        </Field>
      </div>
    </div>
  );
}
