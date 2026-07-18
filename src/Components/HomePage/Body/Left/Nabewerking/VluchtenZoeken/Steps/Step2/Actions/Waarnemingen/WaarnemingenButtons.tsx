import { useContent } from "hooks/useContent";
import {
  useWaarnemingenButtonHandlers,
  type WaarnemingenButtonsProps,
} from "./useWaarnemingenButtonHandlers";

export function WaarnemingenButtons(props: WaarnemingenButtonsProps) {
  const content = useContent();
  const handlers = useWaarnemingenButtonHandlers(props);
  return (
    <>
      <button onClick={handlers.onPrev} className="gray-button">
        {content.common.vorige}
      </button>
      <button
        onClick={handlers.onNext}
        disabled={!props.canNext}
        className="gray-button"
      >
        {content.common.volgende}
      </button>
      <button onClick={handlers.onCancel} className="gray-button">
        {content.common.annuleren}
      </button>
    </>
  );
}
