import DatePicker from "react-datepicker";

const datePickerInputFocus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50";

const dateFieldWhiteBase =
  "bg-white shadow-sm transition-all duration-200 ease-out hover:border-primary/40 hover:shadow-md focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/35 focus-within:ring-offset-2 focus-within:ring-offset-white focus-within:shadow-md";

const labelClass =
  "flex shrink-0 items-center bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white";

export default function TimesliderDateField({
  variant,
  label,
  selected,
  onChange,
}: {
  variant: "from" | "to";
  label: string;
  selected: Date;
  onChange: (date: Date | null) => void;
}) {
  const popperPlacement = variant === "from" ? "bottom-start" : "bottom-end";
  const inputClassName =
    variant === "from"
      ? `!border-0 !shadow-none !rounded-none !rounded-r-lg bg-transparent py-2 px-2.5 w-[118px] !text-xs font-medium text-gray-800 cursor-pointer ${datePickerInputFocus}`
      : `!border-0 !shadow-none !rounded-none !rounded-l-lg bg-transparent py-2 px-2.5 w-[118px] !text-xs font-medium text-gray-800 cursor-pointer ${datePickerInputFocus}`;

  if (variant === "from") {
    return (
      <div className="flex shrink-0 shadow-sm">
        <span className={`${labelClass} rounded-l-lg rounded-r-none`}>{label}</span>
        <div
          className={`flex min-w-0 items-stretch rounded-r-lg rounded-l-none border-y border-r border-gray-200 ${dateFieldWhiteBase}`}
        >
          <DatePicker
            selected={selected}
            onChange={onChange}
            dateFormat="dd/MM/yyyy"
            wrapperClassName="timeslider-datepicker-wrapper"
            calendarClassName="timeslider-datepicker-calendar"
            popperClassName="timeslider-datepicker-popper"
            popperPlacement={popperPlacement}
            className={inputClassName}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 shadow-sm">
      <div
        className={`flex min-w-0 items-stretch rounded-l-lg rounded-r-none border-y border-l border-gray-200 ${dateFieldWhiteBase}`}
      >
        <DatePicker
          selected={selected}
          onChange={onChange}
          dateFormat="dd/MM/yyyy"
          wrapperClassName="timeslider-datepicker-wrapper"
          calendarClassName="timeslider-datepicker-calendar"
          popperClassName="timeslider-datepicker-popper"
          popperPlacement={popperPlacement}
          className={inputClassName}
        />
      </div>
      <span className={`${labelClass} rounded-r-lg rounded-l-none`}>{label}</span>
    </div>
  );
}
