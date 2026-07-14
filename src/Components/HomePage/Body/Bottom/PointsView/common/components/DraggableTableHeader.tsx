import type { Dispatch, DragEventHandler, SetStateAction } from "react";
import { IoClose } from "react-icons/io5";
import { MdFilterAlt } from "react-icons/md";
import { RxDragHandleDots2 } from "react-icons/rx";

type DraggableTableHeaderProps = {
  columns: string[];
  setColumns: Dispatch<SetStateAction<string[]>>;
  handleDragStart: (column: string) => void;
  handleDragOver: DragEventHandler<HTMLTableCellElement>;
  handleDrop: (
    column: string,
    columns: string[],
    setColumns: Dispatch<SetStateAction<string[]>>
  ) => void;
  removeColumn: (
    column: string,
    setColumns: Dispatch<SetStateAction<string[]>>
  ) => void;
};

export default function DraggableTableHeader({
  columns,
  setColumns,
  handleDragStart,
  handleDragOver,
  handleDrop,
  removeColumn,
}: DraggableTableHeaderProps) {
  return (
    <thead className="text-[12px] sticky top-0 bg-white z-10">
      <tr>
        <th className="px-2 py-2">
          <MdFilterAlt className="text-gray-500 text-xl" />
        </th>
        {columns.map((column) => (
          <th
            key={column}
            className="px-2 py-2 cursor-move whitespace-nowrap"
            draggable
            onDragStart={() => handleDragStart(column)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column, columns, setColumns)}
          >
            <div className="flex justify-between items-center gap-1">
              <button title="Drag column">
                <RxDragHandleDots2 />
              </button>
              <span>{column}</span>
              <button onClick={() => removeColumn(column, setColumns)}>
                <IoClose />
              </button>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
