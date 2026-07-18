import { ParentItemHeader } from "./ParentItemHeader";

export function ParentItemBody(input: {
  isDisabled?: boolean;
  title: string;
  children: React.ReactNode;
  checked: boolean;
  setChecked: (checked: boolean) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <div>
      <ParentItemHeader {...input} />
      {input.open && <>{input.children}</>}
    </div>
  );
}
