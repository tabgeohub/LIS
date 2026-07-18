import { IconType } from "react-icons";
import { MdEdit } from "react-icons/md";
import { TiExport } from "react-icons/ti";
import { ToolsTabsType } from "Types";
import content from "../../../../constants/content.json";

export const toolsTabsPart2: {
  id: ToolsTabsType;
  label: string;
  icon: IconType;
  disabled: boolean;
  new?: boolean;
}[] = [
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
