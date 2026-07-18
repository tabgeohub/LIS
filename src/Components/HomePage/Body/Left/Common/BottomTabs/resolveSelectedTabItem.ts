import {
  nabewerkingTabs,
  toolsTabs,
  voorbereidingTabs,
} from "Components/HomePage/Head/constants";
import { FaMagnifyingGlassChart } from "react-icons/fa6";
import { TbFilterQuestion } from "react-icons/tb";
import type { Content } from "hooks/useContent";

export function resolveSelectedTabItem(
  selectedTab: string,
  content: Content
) {
  return [
    ...voorbereidingTabs,
    ...toolsTabs,
    ...nabewerkingTabs,
    {
      id: "timeslider",
      label: content.layout.pages.at(3)!,
      icon: FaMagnifyingGlassChart,
      disabled: false,
    },
    {
      id: "aandachtspuntenFilteren",
      label: "Aandachtspuntent filteren",
      icon: TbFilterQuestion,
      disabled: false,
    },
  ].find((item) => item.id === selectedTab);
}
