import { useState } from "react";
import ScrollButtonsLayout from "Components/Common/ScrollButtonsLayout";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { WaarnemerType } from "Types";
import type { PilotenWaarnemersStep } from "../..";
import type { WaarnemersStep } from "..";
import Buttons from "./Buttons";
import DeleteWaarnemerModal from "../DeleteWaarnemer";

export default function List({
  waarnemers,
  selected,
  setSelected,
  setWaarnemersStep,
  setStep,
  refetch,
}: {
  waarnemers: WaarnemerType[];
  selected: WaarnemerType | null;
  setSelected: (value: WaarnemerType | null) => void;
  setWaarnemersStep: (value: WaarnemersStep) => void;
  setStep: (value: PilotenWaarnemersStep) => void;
  refetch: () => void;
}) {
  const logAction = useLogAction();
  const content = useContent();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  return (
    <div className="h-full">
      <div className="py-2 h-[90%]">
        <p className="text-[12px] border-b border-gray-200 px-2 pb-2">
          {content.tools.pilotenWaarnemers.waarnemers.listText}
        </p>

        <ScrollButtonsLayout
          buttons={
            <Buttons
              selected={selected}
              setWaarnemersStep={setWaarnemersStep}
              setStep={setStep}
              setOpenDeleteModal={setOpenDeleteModal}
            />
          }
        >
          {waarnemers.map((waarnemer) => (
            <div
              key={waarnemer.id}
              className={`text-[14px] pl-5 py-2 border-b border-gray-200 transition-all hover:bg-[#4ff1ff]/60 duration-500 cursor-pointer ${
                selected?.id === waarnemer.id ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                setSelected(waarnemer);
                logAction({
                  message: "User clicked on waarnemer",
                  step: "PilotenWaarnemers - Waarnemers list",
                  newData: {
                    id: waarnemer.id,
                    naam: waarnemer.naam,
                    regio_id: waarnemer.regio_id,
                  },
                });
              }}
            >
              <p>
                {waarnemer.naam}
                <span className="text-gray-400 text-[12px] ml-2">
                  ({waarnemer.regio_id})
                </span>
              </p>
            </div>
          ))}
        </ScrollButtonsLayout>
      </div>

      {selected && (
        <DeleteWaarnemerModal
          selected={selected}
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
          refetch={refetch}
          setSelected={setSelected}
        />
      )}
    </div>
  );
}
