import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import { FaRegCalendarAlt } from "react-icons/fa";

import "react-datepicker/dist/react-datepicker.css";

export default function InputComp({
  label,
  value,
  setValue,
  required = false,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  setValue?: (value: string) => void;
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

      {type === "text" && (
        <input
          value={value}
          onChange={(e) => setValue && setValue(e.target.value)}
          type="text"
          className="inputClass col-span-4"
          disabled={disabled}
        />
      )}

      {type === "date" && (
        <div className="relative col-span-4">
          <DatePicker
            selected={value ? dayjs(value).toDate() : null}
            onChange={(date: Date | null) =>
              setValue && setValue(date ? dayjs(date).format("YYYY-MM-DD") : "")
            }
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/mm/jjjj"
            className="inputClass cursor-pointer"
            disabled={disabled}
          />

          <FaRegCalendarAlt
            className="absolute right-[10px] cursor-pointer top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
        </div>
      )}

      {type === "number" && (
        <input
          value={value}
          onChange={(e) => setValue && setValue(e.target.value)}
          type="number"
          className="inputClass col-span-4"
        />
      )}
    </div>
  );
}
