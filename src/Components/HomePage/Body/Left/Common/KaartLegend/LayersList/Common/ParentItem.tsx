import type { ParentItemProps } from "./ParentItemProps";
import { useState } from "react";
import { ParentItemBody } from "./ParentItemBody";

export const ParentItem = ({
  isDisabled = false,
  title,
  children,
  checked,
  setChecked,
}: ParentItemProps) => {
  const [open, setOpen] = useState(false);
  return (
    <ParentItemBody
      isDisabled={isDisabled}
      title={title}
      checked={checked}
      setChecked={setChecked}
      open={open}
      setOpen={setOpen}
    >
      {children}
    </ParentItemBody>
  );
};
