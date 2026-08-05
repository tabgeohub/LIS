import { FaMapMarkedAlt } from "react-icons/fa";
import { PointItemViewProps } from "./pointItemTypes";

export default function DefaultPointItem(
  props: PointItemViewProps & { showCheckbox: boolean }
) {
  const { point } = props;
  const herhalenValue =
    point.herhalen === 1 || point.herhalen === "1" ? "Ja" : "Nee";
  const details = [
    ["Activiteit", props.activityLabel],
    ["Organisatie", props.organizationLabel],
    ["Letten op:", point.specifiek_letten_op],
    ["Aanmaakdatum:", point.datum],
    ["Herhalen:", herhalenValue],
  ];

  return (
    <div
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      className={`flex items-start cursor-pointer gap-x-2 py-2 my-1 px-2 transition-all duration-300 ${
        props.isSelected
          ? "bg-gray-200 shadow-sm rounded"
          : "hover:bg-blue-100 shadow-sm rounded"
      }`}
      onClick={props.onItemClick}
    >
      <div className="flex items-center gap-x-2">
        {props.showCheckbox && (
          <input
            checked={props.isSelected}
            onClick={props.onCheckboxClick}
            type="checkbox"
            className="size-3 cursor-pointer"
            readOnly
          />
        )}
        <FaMapMarkedAlt className="size-6 text-blue-500" />
      </div>
      <div className="flex flex-col ml-6 text-[10px]">
        <div className="flex gap-x-1 font-medium">
          <p className="text-gray-800">{point.omschrijving}</p>
        </div>
        {details.map(([label, value]) => (
          <div className="flex gap-x-1" key={label}>
            <p className="text-gray-600">{label} </p>
            <p className="text-gray-600">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
