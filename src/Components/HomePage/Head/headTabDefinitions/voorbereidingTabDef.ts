import { VoorbereidingTabsType } from "Types";
import { IconType } from "react-icons";

export type VoorbereidingTabDef = {
  id: VoorbereidingTabsType;
  label: string;
  icon: IconType;
  disabled: boolean;
  new?: boolean;
};
