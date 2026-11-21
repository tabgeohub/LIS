import { useMemo, useState } from "react";
import InputComp from "Components/Common/FormComponents/InputComp";
import SelectComp from "Components/Common/FormComponents/SelectComp";
import { useUpdateData } from "api-hooks/mutations";
import toast from "react-hot-toast";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { useAuth } from "hooks/zustand/ui";
import { useConstSelectOptions } from "hooks/consts/useConstSelectOptions";
import { WaarnemerType } from "Types";
import type { WaarnemersStep } from ".";
import Loading from "../Loading";

export default function EditWaarnemer({
  selected,
  setSelected,
  setWaarnemersStep,
  refetch,
}: {
  selected: WaarnemerType;
  setSelected: (value: WaarnemerType | null) => void;
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

  const [naam, setNaam] = useState(selected.naam);
  const [regioId, setRegioId] = useState(selected.regio_id);
  const { update, loading } = useUpdateData(
    `/waarnemers/${encodeURIComponent(selected.id)}`
  );

  function handleUpdate() {
    const effectiveRegio = isAdmin ? regioId : selected.regio_id;
    if (!naam.trim() || !effectiveRegio) {
      toast.error(c.failToast);
      return;
    }

    update({
      data: { naam: naam.trim(), regio_id: effectiveRegio },
      onSuccess: () => {
        setSelected(null);
        setWaarnemersStep("list");
        refetch();
      },
    });

    logAction({
      message: "User clicked 'Save' button",
      step: "PilotenWaarnemers - Edit waarnemer",
      newData: { id: selected.id, naam, regio_id: effectiveRegio },
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
            options={assignableRegioOptions}
          />
        ) : (
          <InputComp
            label={c.regio}
            value={selected.regio_id}
            setValue={() => undefined}
            type="text"
            disabled
          />
        )}
      </div>

      <div className="flex items-center justify-end gap-x-2 mt-4 mr-4">
        <button type="button" onClick={handleUpdate} className="gray-button">
          {content.common.wijzigen}
        </button>
        <button
          type="button"
          onClick={() => {
            setWaarnemersStep("list");
            logAction({
              message: "User clicked 'Cancel' button",
              step: "PilotenWaarnemers - Edit waarnemer",
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
