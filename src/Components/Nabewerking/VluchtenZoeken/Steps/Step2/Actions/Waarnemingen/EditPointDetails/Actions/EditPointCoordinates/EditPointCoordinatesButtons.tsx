import useLogAction from "hooks/useLogAction";

type EditPointCoordinatesButtonsProps = {
  vorigeLabel: string;
  opslaanLabel: string;
  onPrevious: () => void;
  onSubmit: () => void;
};

export function EditPointCoordinatesButtons(
  props: EditPointCoordinatesButtonsProps
) {
  const logAction = useLogAction();

  return (
    <>
      <button
        onClick={() => {
          props.onPrevious();
          logAction({
            message: "User clicked 'Previous' button",
            step: "Second step - Edit point coordinates",
          });
        }}
        className="gray-button"
      >
        {props.vorigeLabel}
      </button>

      <button onClick={props.onSubmit} className="gray-button">
        {props.opslaanLabel}
      </button>
    </>
  );
}
