import { Field } from "formik";

export default function InputFormik({
  label,
  name,
  required = false,
  type = "text",
  disabled = false,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-6 gap-x-2 items-center">
      <label className="col-span-2" htmlFor={name}>
        {label}
      </label>

      <div className="col-span-4">
        <Field
          name={name}
          type={type}
          required={required}
          disabled={disabled}
          placeholder={label}
          className="inputClass !w-[80%] !text-xs"
        />
      </div>
    </div>
  );
}
