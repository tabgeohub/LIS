import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import { FaRegCalendarAlt } from "react-icons/fa";

import "react-datepicker/dist/react-datepicker.css";

export type InputCompProps = {
  label: string;
  value: string;
  setValue?: (value: string) => void;
  required?: boolean;
  type?: string;
  disabled?: boolean;
  nativeDate?: boolean;
  min?: string;
  inputClassName?: string;
};

function TextInputField(props: {
  value: string;
  setValue?: (value: string) => void;
  inputType: "text" | "number" | "date";
  disabled: boolean;
  inputClassName: string;
  min?: string;
}) {
  return (
    <input
      value={props.value}
      onChange={(e) => props.setValue?.(e.target.value)}
      type={props.inputType}
      min={props.min}
      className={`inputClass col-span-4 ${props.inputClassName}`}
      disabled={props.disabled}
    />
  );
}

function DatePickerField(props: {
  value: string;
  setValue?: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="relative col-span-4">
      <DatePicker
        selected={props.value ? dayjs(props.value).toDate() : null}
        onChange={(date: Date | null) =>
          props.setValue?.(date ? dayjs(date).format("YYYY-MM-DD") : "")
        }
        dateFormat="dd/MM/yyyy"
        placeholderText="dd/mm/jjjj"
        className="inputClass cursor-pointer"
        disabled={props.disabled}
      />

      <FaRegCalendarAlt
        className="absolute right-[10px] cursor-pointer top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
        size={16}
      />
    </div>
  );
}

function isTextOrNumberType(type: string): type is "text" | "number" {
  return type === "text" || type === "number";
}

function isNativeDateType(type: string, nativeDate: boolean): boolean {
  return type === "date" && nativeDate;
}

function resolveInputField(props: InputCompProps & {
  type: string;
  disabled: boolean;
  nativeDate: boolean;
  inputClassName: string;
}) {
  if (isTextOrNumberType(props.type)) {
    return (
      <TextInputField
        value={props.value}
        setValue={props.setValue}
        inputType={props.type}
        disabled={props.disabled}
        inputClassName={props.inputClassName}
      />
    );
  }

  if (isNativeDateType(props.type, props.nativeDate)) {
    return (
      <TextInputField
        value={props.value}
        setValue={props.setValue}
        inputType="date"
        disabled={props.disabled}
        inputClassName={props.inputClassName}
        min={props.min}
      />
    );
  }

  if (props.type === "date") {
    return (
      <DatePickerField
        value={props.value}
        setValue={props.setValue}
        disabled={props.disabled}
      />
    );
  }

  return null;
}

export default function InputComp({
  label,
  value,
  setValue,
  required = false,
  type = "text",
  disabled = false,
  nativeDate = false,
  min,
  inputClassName = "",
}: InputCompProps) {
  return (
    <div className="grid grid-cols-6 gap-x-2 items-center">
      <p className="col-span-2 labelClass">
        {label}
        {required && <span className="text-gray-500"> *</span>}
      </p>
      {resolveInputField({
        label,
        value,
        setValue,
        type,
        disabled,
        nativeDate,
        min,
        inputClassName,
      })}
    </div>
  );
}
