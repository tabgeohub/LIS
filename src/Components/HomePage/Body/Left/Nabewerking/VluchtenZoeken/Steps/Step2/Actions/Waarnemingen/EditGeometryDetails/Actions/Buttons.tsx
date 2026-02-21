import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function Buttons({
  setOpenEdit,
}: {
  setOpenEdit: (value: boolean) => void;
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
    </div>
  );
}

