import useLogAction from "hooks/useLogAction";

export function ParentItemCheckbox({
  title,
  isDisabled,
  checked,
  setChecked,
}: {
  title: string;
  isDisabled?: boolean;
  checked: boolean;
  setChecked: (checked: boolean) => void;
}) {
  const logAction = useLogAction();
  return (
    <label
      htmlFor={title}
      className="flex items-center cursor-pointer gap-2 py-2 w-full"
    >
      <input
        type="checkbox"
        id={title}
        disabled={isDisabled}
        checked={checked}
        onChange={(e) => {
          setChecked(e.target.checked);
          logAction({
            message: `User ${
              e.target.checked ? "checked" : "unchecked"
            } parent item '${title}'`,
            step: "Kaartlegende",
          });
        }}
      />
      <span>{title}</span>
    </label>
  );
}
