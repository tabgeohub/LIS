import useLogAction from "hooks/useLogAction";
import DeletePoint from "../DeletePoint";
import { useContent } from "hooks/useContent";
import { FinishedPointType } from "Types/finished_plans";

export default function Buttons({
  setAction,
  setOpenEdit,
  handleUpdate,
  selectedPoint,
}: {
  setAction: (value: string) => void;
  setOpenEdit: (value: boolean) => void;
  handleUpdate: () => void;
  selectedPoint?: FinishedPointType;
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
            step: "Second step - Form",
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
            step: "Second step - Form",
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
          setAction("changePoint");

          logAction({
            message: "User clicked 'Change point' button",
            step: "Second step - Form",
          });
        }}
        className="gray-button"
      >
        {
          content.nabewerking.vluchtenZoeken.step2.waarnemingen.editPointDetails
            .changePointBtn
        }
      </button>

      <DeletePoint setOpenEdit={setOpenEdit} />

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
