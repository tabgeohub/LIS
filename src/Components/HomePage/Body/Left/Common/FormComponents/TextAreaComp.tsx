export default function TextAreaComp({
  value,
  setValue,
  label,
}: {
  value: string;
  setValue: (value: string) => void;
  label: string;
}) {
  return (
    <>
      <p className="col-span-2 labelClass">{label}</p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="col-span-4 inputClass !w-[80%] pl-2"
        rows={4}
      />
    </>
  );
}
