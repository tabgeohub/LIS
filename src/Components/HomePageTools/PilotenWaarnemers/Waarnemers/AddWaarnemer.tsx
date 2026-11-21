import { useMemo, useState } from "react";
import InputComp from "Components/Common/FormComponents/InputComp";
import SelectComp from "Components/Common/FormComponents/SelectComp";
import { useCreateData } from "api-hooks/mutations";
import toast from "react-hot-toast";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { useAuth } from "hooks/zustand/ui";
import { useConstSelectOptions } from "hooks/consts/useConstSelectOptions";
import type { WaarnemersStep } from ".";
import Loading from "../Loading";

export default function AddWaarnemer({
  setWaarnemersStep,
  refetch,
}: {
  setWaarnemersStep: (value: WaarnemersStep) => void;
  refetch: () => void;
}) {
  const logAction = useLogAction();
  const content = useContent();
  const c = content.tools.pilotenWaarnemers.waarnemers;
  const { user } = useAuth();
  const isAdmin = user.role === "admin";
  const regioOptions = useConstSelectOptions("regios");
  const assignableRegioOptions = useMemo(
    () => regioOptions.filter((option) => option.value !== "admin"),
    [regioOptions]
  );

  const [naam, setNaam] = useState("");
  const [regioId, setRegioId] = useState(isAdmin ? "" : user.role);
  const { create, loading } = useCreateData("/waarnemers");

  function handleCreate() {
    const effectiveRegio = isAdmin ? regioId : user.role;
    if (!naam.trim() || !effectiveRegio) {
      toast.error(c.failToast);
      return;
    }

    create({
      data: {
        naam: naam.trim(),
        regio_id: effectiveRegio,
      },
      onSuccess: () => {
        setWaarnemersStep("list");
        refetch();
      },
    });

    logAction({
      message: "User clicked 'Save' button to add waarnemer",
      step: "PilotenWaarnemers - Add waarnemer",
      newData: { naam, regio_id: effectiveRegio },
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
        {isAdmin ? (
          <SelectComp
            label={c.regio}
            value={regioId}
            setValue={setRegioId}
            options={[
              { label: "Selecteer een regio", value: "" },
              ...assignableRegioOptions,
            ]}
          />
        ) : (
          <InputComp
            label={c.regio}
            value={user.role}
            setValue={() => undefined}
            type="text"
            disabled
          />
        )}
      </div>

      <div className="flex items-center justify-end gap-x-2 mt-4 mr-4">
        <button
          type="button"
          disabled={!naam.trim() || (isAdmin && !regioId)}
          onClick={handleCreate}
          className="gray-button"
        >
          {content.common.toevoegen}
        </button>
        <button
          type="button"
          onClick={() => {
            setWaarnemersStep("list");
            logAction({
              message: "User clicked 'Cancel' button",
              step: "PilotenWaarnemers - Add waarnemer",
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
