import InputComp, {
  type InputCompProps,
} from "Components/Common/FormComponents/InputComp";

type FilterInputProps = Omit<InputCompProps, "nativeDate" | "min"> & {
  minToday?: boolean;
  setValue: (value: string) => void;
};

export function FilterInput({
  minToday = true,
  inputClassName = "!w-[75%]",
  ...props
}: FilterInputProps) {
  const today = minToday ? new Date().toISOString().split("T")[0] : "";

  return (
    <InputComp
      {...props}
      nativeDate
      min={today}
      inputClassName={inputClassName}
    />
  );
}
