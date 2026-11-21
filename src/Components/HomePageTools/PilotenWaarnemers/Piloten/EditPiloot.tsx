import { useState } from "react";
import InputComp from "Components/Common/FormComponents/InputComp";
import SelectComp from "Components/Common/FormComponents/SelectComp";
import { useUpdateData } from "api-hooks/mutations";
import toast from "react-hot-toast";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { PilootType } from "Types";
import type { PilotenStep } from ".";
import Loading from "../Loading";

const STATUS_OPTIONS = [
  { label: "active", value: "active" },
  { label: "inactive", value: "inactive" },
];

export default function EditPiloot({
  selected,
  setSelected,
  setPilotenStep,
  refetch,
}: {
  selected: PilootType;
  setSelected: (value: PilootType | null) => void;
  setPilotenStep: (value: PilotenStep) => void;
  refetch: () => void;
}) {
  const logAction = useLogAction();
  const content = useContent();
  const c = content.tools.pilotenWaarnemers.piloten;
  const [naam, setNaam] = useState(selected.naam);
  const [status, setStatus] = useState(selected.status || "active");
  const { update, loading } = useUpdateData(
    `/piloten/${encodeURIComponent(selected.id)}`
  );

  function handleUpdate() {
    if (!naam.trim() || !status) {
      toast.error(c.failToast);
      return;
    }

    update({
      data: { naam: naam.trim(), status },
      onSuccess: () => {
        setSelected(null);
        setPilotenStep("list");
        refetch();
      },
    });

    logAction({
      message: "User clicked 'Save' button",
      step: "PilotenWaarnemers - Edit piloot",
      newData: { id: selected.id, naam, status },
    });
  }

  return (
    <div className="py-2 relative h-full">
      <div className="pr-10 pl-4 mt-4 flex flex-col gap-3">
        <InputComp
          label={c.naam}
          value={naam}
          setValue={setNaam}
          type="text"
        />
        <SelectComp
          label={c.status}
          value={status}
          setValue={setStatus}
          options={STATUS_OPTIONS}
        />
      </div>

      <div className="flex items-center justify-end gap-x-2 mt-4 mr-4">
        <button type="button" onClick={handleUpdate} className="gray-button">
          {content.common.wijzigen}
        </button>
        <button
          type="button"
          onClick={() => {
            setPilotenStep("list");
            logAction({
              message: "User clicked 'Cancel' button",
              step: "PilotenWaarnemers - Edit piloot",
            });
          }}
          className="gray-button"
        >
          {content.common.annuleren}
        </button>
      </div>

      {loading && <Loading />}
    </div>
  );
}
