import { FaPlus } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { GrDocumentMissing } from "react-icons/gr";
import { AiFillInfoCircle } from "react-icons/ai";
import content from "../../../../constants/content.json";
import type { VoorbereidingTabDef } from "./voorbereidingTabDef";

export const voorbereidingTabsPart2: VoorbereidingTabDef[] = [
  { id: "prepareFlightPlan", label: content.voorbereiding.tabs.prepareFlightPlan, icon: FaCheck, disabled: false },
  { id: "addPoint", label: content.voorbereiding.tabs.addPoint, icon: FaPlus, disabled: false },
  { id: "removeFlightPlan", label: content.voorbereiding.tabs.removeFlightPlan, icon: GrDocumentMissing, disabled: false },
  { id: "viewPlan", label: content.voorbereiding.tabs.viewPlan, icon: AiFillInfoCircle, disabled: false },
];
