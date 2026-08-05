import { FaMapMarkedAlt } from "react-icons/fa";
import { IoMdImage } from "react-icons/io";
import { PointItemViewProps } from "./pointItemTypes";

export default function CompactPointItem(props: PointItemViewProps) {
  const { point } = props;
  return (
    <div
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      className={`p-1.5 relative ${
        props.isSelected ? "bg-gray-100" : "hover:bg-gray-50"
      } transition-all cursor-pointer`}
      onClick={props.onItemClick}
    >
      <div className="flex items-center gap-x-2">
        <FaMapMarkedAlt className="size-6 text-blue-500" />
        <p className="text-[12px]">{point.omschrijving}</p>
      </div>
      <div className="text-[10px] text-gray-500 mt-2">
        <p>Soort: "Not Added Yet"</p>
        <p>Specific letten op: {point.specifiek_letten_op}</p>
        <p>Organisatie: {props.organizationLabel}</p>
        <p>Activiteit: {props.activityLabel}</p>
      </div>
      {props.attachmentCount > 0 && (
        <div className="absolute mt-4 bottom-0 right-4">
          <IoMdImage className="size-4 text-gray-500" />
          <div className="absolute bottom-2 -right-3 bg-[#3B82F6] rounded-full px-1 text-white text-[10px]">
            {props.attachmentCount}
          </div>
        </div>
      )}
    </div>
  );
}
