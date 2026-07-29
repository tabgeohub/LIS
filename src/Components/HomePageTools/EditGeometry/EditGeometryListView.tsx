import Header from "./Header";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import SingleGeometry from "./SingleGeometry";
import type { Geometry } from "hooks/features";
import { geometryDisplayName } from "./EditForm/helpers/labels";

type Props = {
  filterTermSetter: (term: string) => void;
  dbGeometries: Geometry[];
  filteredGeometries: Geometry[];
  onEditClick: (geometry: Geometry) => void;
  onDeleteClick: (geometry: Geometry) => void;
};

export function EditGeometryListView(props: Props) {
  return (
    <>
      <Header setFilterTerm={props.filterTermSetter} />
      <ScrollButtonsLayout className="h-[75%]" buttons={<Buttons />}>
        <div className="pb-40">
          {props.dbGeometries?.length === 0 && (
            <div className="flex flex-col items-center justify-center">
              <p className="text-center text-gray-400 text-[12px]">
                Geen geometrieën gevonden
              </p>
            </div>
          )}
          {props.filteredGeometries.map((geometry) => (
            <SingleGeometry
              key={geometry.id}
              geometry={geometry}
              onEditClick={props.onEditClick}
              onDeleteClick={props.onDeleteClick}
            />
          ))}
        </div>
      </ScrollButtonsLayout>
    </>
  );
}

export function logDeleteGeometryClick(
  geometry: Geometry,
  logAction: (input: {
    message: string;
    step: string;
    newData?: Record<string, unknown>;
  }) => void
) {
  logAction({
    message: "User clicked 'Delete' button to open confirmation modal",
    step: "Edit Geometry",
    newData: { geometry: geometryDisplayName(geometry) },
  });
}
