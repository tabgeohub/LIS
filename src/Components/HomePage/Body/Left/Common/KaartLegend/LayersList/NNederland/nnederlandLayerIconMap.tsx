import { TfiLayoutAccordionList } from "react-icons/tfi";
import { BsFillPentagonFill } from "react-icons/bs";
import { IoTriangleSharp } from "react-icons/io5";
import { nnLineIcon } from "./nnederlandIconPrimitives";

/** Layer-id → legend icon lookup (declarative map). */
export const nnederlandLayerIconMap = {
  betonning: <TfiLayoutAccordionList className="fill-blue-400" />,
  arz: nnLineIcon("#ef4444"),
  strandpaviljoens: (
    <div className="relative">
      <BsFillPentagonFill className="fill-orange-400" />
      <div className="h-[3px] aspect-square bg-black absolute top-[48%] left-[50%] translate-x-[-50%]" />
    </div>
  ),
  strandpalen: (
    <div className="relative">
      <div className="h-[12px] aspect-square bg-orange-500 rounded-full border border-orange-600" />
      <div className="h-[2px] aspect-square bg-black absolute top-[48%] left-[50%] translate-x-[-50%]" />
    </div>
  ),
  damnummers: (
    <div className="w-[6px] aspect-square border-2 border-black bg-orange-600 rotate-45" />
  ),
  lozingspunten: (
    <div className="relative">
      <IoTriangleSharp className="fill-green-400" />
      <div className="h-[2px] aspect-square bg-black absolute top-[48%] left-[50%] translate-x-[-50%] translate-y-[50%] rounded-full" />
    </div>
  ),
  kwelderdammen: (
    <div className="relative w-full flex items-center justify-center">
      {nnLineIcon("#f97316")}
      <div className="h-[8px] w-[2px] bg-gray-700 absolute right-1.5" />
    </div>
  ),
  eemsverdrag: (
    <div className="w-[80%] aspect-square border-2 border-dashed border-red-500" />
  ),
  bruggenSluizen: (
    <div className="relative w-full flex items-center justify-center">
      <div className="w-[80%] aspect-square bg-green-400" />
      <div className="h-[4px] aspect-square bg-black absolute left-[50%] -translate-x-[50%] -translate-y-[50%] top-[50%] rounded-full" />
    </div>
  ),
};
