import InputComp, {
  type InputCompProps,
} from "../FormComponents/InputComp";

type FilterInputProps = Omit<InputCompProps, "nativeDate" | "min"> & {
  minToday?: boolean;
  setValue: (value: string) => void;
};

export function FilterInput({
  label,
  value,
  setValue,
  required = false,
  type = "text",
  disabled = false,
  minToday = true,
}: FilterInputProps) {
  const today = minToday ? new Date().toISOString().split("T")[0] : "";

  return (
    <InputComp
      label={label}
      value={value}
      setValue={setValue}
      required={required}
      type={type}
      disabled={disabled}
      nativeDate
      min={today}
      inputClassName="!w-[75%]"
    />
  );
}
