import { NabewerkingTabsType } from "Types";
import { FaMagnifyingGlassChart } from "react-icons/fa6";
import { GiPieChart } from "react-icons/gi";
import { RiFileList2Line } from "react-icons/ri";
import { IconType } from "react-icons";
import content from "../../../../constants/content.json";

export const nabewerkingTabs: {
  id: NabewerkingTabsType;
  label: string;
  icon: IconType;
  disabled: boolean;
  new?: boolean;
}[] = [
  {
    id: "vluchtZoeken",
    label: content.nabewerking.tabs.vluchtZoeken,
    icon: FaMagnifyingGlassChart,
    disabled: false,
  },
  {
    id: "waarnemings",
    label: content.nabewerking.tabs.waarnemings,
    icon: GiPieChart,
    disabled: false,
  },
  {
    id: "vluchtplanStatus",
    label: content.nabewerking.tabs.vluchtplanStatus,
    icon: RiFileList2Line,
    disabled: false,
  },
];
