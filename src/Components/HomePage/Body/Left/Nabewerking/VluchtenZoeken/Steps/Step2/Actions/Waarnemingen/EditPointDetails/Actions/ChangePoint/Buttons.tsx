import { useContent } from "hooks/useContent";
import useLogAction from "hooks/useLogAction";

export default function Buttons({
  setAction,
  setOpenFilter,
  handleSubmit,
}: {
  setAction: (value: string) => void;
  setOpenFilter: (value: boolean) => void;
  handleSubmit;
}) {
  const logAction = useLogAction();

  const content = useContent();

  return (
    <div className="flex gap-x-2 justify-end mt-2">
      <button
        onClick={() => {
          setAction("form");

          logAction({
            message: "User clicked 'Previous' button",
            step: "Second step - Change point",
          });
        }}
        className="gray-button"
      >
        {content.common.vorige}
      </button>

      <button
        onClick={() => {
          setOpenFilter(true);

          logAction({
            message: "User clicked 'Filter' button",
            step: "Second step - Change point",
          });
        }}
        className="gray-button"
      >
        {
          content.nabewerking.vluchtenZoeken.step2.waarnemingen.editPointDetails
            .kaartfilter
        }
      </button>

      <button
        onClick={() => {
          handleSubmit();
        }}
        className="gray-button"
      >
        {content.common.volgende}
      </button>
    </div>
  );
}
