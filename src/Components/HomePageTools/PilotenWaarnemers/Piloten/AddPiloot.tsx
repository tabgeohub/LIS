import { useState } from "react";
import InputComp from "Components/Common/FormComponents/InputComp";
import SelectComp from "Components/Common/FormComponents/SelectComp";
import { useCreateData } from "api-hooks/mutations";
import toast from "react-hot-toast";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import type { PilotenStep } from ".";
import Loading from "../Loading";

const STATUS_OPTIONS = [
  { label: "active", value: "active" },
  { label: "inactive", value: "inactive" },
];

export default function AddPiloot({
  setPilotenStep,
  refetch,
}: {
  setPilotenStep: (value: PilotenStep) => void;
  refetch: () => void;
}) {
  const logAction = useLogAction();
  const content = useContent();
  const c = content.tools.pilotenWaarnemers.piloten;
  const [naam, setNaam] = useState("");
  const [status, setStatus] = useState("active");
  const { create, loading } = useCreateData("/piloten");

  function handleCreate() {
    if (!naam.trim() || !status) {
      toast.error(c.failToast);
      return;
    }

    create({
      data: { naam: naam.trim(), status },
      onSuccess: () => {
        setPilotenStep("list");
        refetch();
      },
    });

    logAction({
      message: "User clicked 'Save' button to add piloot",
      step: "PilotenWaarnemers - Add piloot",
      newData: { naam, status },
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
        <button
          type="button"
          disabled={!naam.trim()}
          onClick={handleCreate}
          className="gray-button"
        >
          {content.common.toevoegen}
        </button>
        <button
          type="button"
          onClick={() => {
            setPilotenStep("list");
            logAction({
              message: "User clicked 'Cancel' button",
              step: "PilotenWaarnemers - Add piloot",
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
