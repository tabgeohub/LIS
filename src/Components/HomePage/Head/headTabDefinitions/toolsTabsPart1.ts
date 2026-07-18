import { IconType } from "react-icons";
import { IoNewspaperOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { RiRestartFill } from "react-icons/ri";
import { ToolsTabsType } from "Types";
import content from "../../../../constants/content.json";

export const toolsTabsPart1: {
  id: ToolsTabsType;
  label: string;
  icon: IconType;
  disabled: boolean;
  new?: boolean;
}[] = [
  {
    id: "emailijst",
    label: content.tools.tabs.emailijst,
    icon: IoNewspaperOutline,
    disabled: false,
  },
  {
    id: "verwijderen",
    label: content.tools.tabs.verwijderen,
    icon: MdDelete,
    disabled: false,
  },
  {
    id: "startgebied",
    label: content.tools.tabs.startgebied,
    icon: RiRestartFill,
    disabled: false,
  },
];
