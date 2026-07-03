import { ToolsTabsType } from "Types";
import { IoNewspaperOutline } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";
import { RiRestartFill } from "react-icons/ri";
import { TiExport } from "react-icons/ti";
import { IconType } from "react-icons";
import content from "../../../../constants/content.json";

export const toolsTabs: {
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
  {
    id: "exporteer",
    label: content.tools.tabs.exporteer,
    icon: TiExport,
    disabled: false,
  },
  {
    id: "editGeometry",
    label: content.tools.tabs.editGeometry,
    icon: MdEdit,
    disabled: false,
    new: true,
  },
];
