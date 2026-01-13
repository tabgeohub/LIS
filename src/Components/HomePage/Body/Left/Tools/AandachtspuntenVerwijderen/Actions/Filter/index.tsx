import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";

export default function Filter() {
  const { setMainStep } = useDeletePointState();

  return (
    <div className="p-1.5">
      Filter
      <div className="flex justify-end mt-6">
        <button className="gray-button" onClick={() => setMainStep("main")}>
          Annuleren
        </button>
      </div>
    </div>
  );
}
