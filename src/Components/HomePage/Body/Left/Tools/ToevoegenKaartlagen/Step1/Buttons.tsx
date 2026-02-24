import { useTabState } from "@helpers/ZustandStates/tabState";

export default function Buttons() {
  const submitStep1 = () => { };
  const { setSelectedTab } = useTabState();

  return (
    <div className="flex justify-end gap-x-1 p-2">
      <button className="gray-button" onClick={submitStep1}>
        Zoeken
      </button>

      <button className="gray-button" onClick={() => setSelectedTab("none")}>
        Annuleren
      </button>
    </div>
  );
}
