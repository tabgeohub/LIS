import { useContent } from "hooks/useContent";
import { useTabState } from "@helpers/ZustandStates/tabState";

export default function Buttons() {
  const content = useContent();
  const { setSelectedTab } = useTabState();

  function handleCancel() {
    setSelectedTab("none");
  }

  return (
    <>
      <button onClick={handleCancel} className="gray-button">
        {content.common.annuleren}
      </button>
    </>
  );
}

