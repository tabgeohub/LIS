import {
  ParentItemCheckbox,
  ParentItemToggle,
} from "./ParentItemControls";
import { ParentItemRow } from "./ParentItemRow";

export function ParentItemHeader(input: {
  isDisabled?: boolean;
  title: string;
  checked: boolean;
  setChecked: (checked: boolean) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <ParentItemRow isDisabled={input.isDisabled}>
      <ParentItemToggle
        title={input.title}
        open={input.open}
        setOpen={input.setOpen}
      />
      <ParentItemCheckbox
        title={input.title}
        isDisabled={input.isDisabled}
        checked={input.checked}
        setChecked={input.setChecked}
      />
    </ParentItemRow>
  );
}
