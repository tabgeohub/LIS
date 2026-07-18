export type ParentItemProps = {
  isDisabled?: boolean;
  title: string;
  children: React.ReactNode;
  checked: boolean;
  setChecked: (checked: boolean) => void;
};
