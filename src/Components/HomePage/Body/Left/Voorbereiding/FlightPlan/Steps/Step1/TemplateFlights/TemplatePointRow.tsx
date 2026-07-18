import { FaMapPin } from "react-icons/fa6";

export function TemplatePointRow(props: {
  point: any;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={props.onEnter}
      onMouseLeave={props.onLeave}
      className="p-2 hover:bg-blue-100/70"
    >
      <div className="flex gap-x-2 items-center">
        <FaMapPin className="text-primary" />
        <span className="text-gray-800 text-lg">{props.point.omschrijving}</span>
      </div>
      <div className="pl-6 text-xs font-semibold text-gray-600 flex gap-x-1">
        <p>X : {props.point.xcoordinaat_rd.toFixed(5)}</p>
        <p> / </p>
        <p>Y : {props.point.ycoordinaat_rd.toFixed(5)}</p>
      </div>
    </div>
  );
}
