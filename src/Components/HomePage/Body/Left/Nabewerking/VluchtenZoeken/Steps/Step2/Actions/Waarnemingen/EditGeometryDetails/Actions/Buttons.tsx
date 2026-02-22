import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { FinishedGeometryType } from "Types/finished_plans";

export default function Buttons({
  setAction,
  setOpenEdit,
  handleUpdate,
  selectedGeometry,
}: {
  setAction: (value: string) => void;
  setOpenEdit: (value: boolean) => void;
  handleUpdate: () => void;
  selectedGeometry?: FinishedGeometryType;
}) {
  const logAction = useLogAction();
  const content = useContent();

  return (
    <div className="mt-6 flex gap-x-1 justify-end mr-2">
      <button
        onClick={() => {
          setOpenEdit(false);

          logAction({
            message: "User clicked 'Cancel' button",
            step: "Second step - Edit geometry",
          });
        }}
        className="gray-button"
      >
        {content.common.vorige}
      </button>

      <button
        onClick={() => {
          setAction("foto");

          logAction({
            message: "User clicked 'Foto's' button",
            step: "Second step - Edit geometry",
          });
        }}
        className="gray-button"
      >
        {
          content.nabewerking.vluchtenZoeken.step2.waarnemingen.editPointDetails
            .fotoBtn
        }
      </button>

      <button
        onClick={() => {
          handleUpdate();
        }}
        className="gray-button"
      >
        {content.common.opslaan}
      </button>
    </div>
  );
}

