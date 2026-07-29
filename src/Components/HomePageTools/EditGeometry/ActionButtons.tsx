import { MdDelete, MdEdit } from "react-icons/md";
import type { EditGeometryActionProps } from "./editGeometryActionProps";

export default function ActionButtons({
  geometry,
  onEditClick,
  onDeleteClick,
}: EditGeometryActionProps) {
  return (
    <div className="text-blue-500 text-xs font-medium mt-2.5 flex items-center gap-x-1">
      <span
        onClick={(e) => {
          e.stopPropagation();
          onEditClick(geometry);
        }}
        className="cursor-pointer hover:text-blue-600 underline hover:font-semibold transition-all flex items-center gap-x-1"
      >
        <MdEdit className="size-3.5" />
        Bewerken
      </span>

      <span className="mx-2">-</span>

      <span
        onClick={(e) => {
          e.stopPropagation();
          onDeleteClick(geometry);
        }}
        className="cursor-pointer hover:text-blue-600 underline hover:font-semibold transition-all flex items-center gap-x-1"
      >
        <MdDelete className="size-3.5" />
        Verwijderen
      </span>
    </div>
  );
}
