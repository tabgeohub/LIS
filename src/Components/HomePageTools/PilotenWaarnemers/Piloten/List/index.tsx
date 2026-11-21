import { useState } from "react";
import ScrollButtonsLayout from "Components/Common/ScrollButtonsLayout";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";
import { PilootType } from "Types";
import type { PilotenWaarnemersStep } from "../..";
import type { PilotenStep } from "..";
import Buttons from "./Buttons";
import DeletePilootModal from "../DeletePiloot";

export default function List({
  piloten,
  selected,
  setSelected,
  setPilotenStep,
  setStep,
  refetch,
}: {
  piloten: PilootType[];
  selected: PilootType | null;
  setSelected: (value: PilootType | null) => void;
  setPilotenStep: (value: PilotenStep) => void;
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
          {content.tools.pilotenWaarnemers.piloten.listText}
        </p>

        <ScrollButtonsLayout
          buttons={
            <Buttons
              selected={selected}
              setPilotenStep={setPilotenStep}
              setStep={setStep}
              setOpenDeleteModal={setOpenDeleteModal}
            />
          }
        >
          {piloten.map((piloot) => (
            <div
              key={piloot.id}
              className={`text-[14px] pl-5 py-2 border-b border-gray-200 transition-all hover:bg-[#4ff1ff]/60 duration-500 cursor-pointer ${
                selected?.id === piloot.id ? "bg-gray-200" : ""
              }`}
              onClick={() => {
                setSelected(piloot);
                logAction({
                  message: "User clicked on piloot",
                  step: "PilotenWaarnemers - Piloten list",
                  newData: { id: piloot.id, naam: piloot.naam },
                });
              }}
            >
              <p>
                {piloot.naam}
                <span className="text-gray-400 text-[12px] ml-2">
                  ({piloot.status})
                </span>
              </p>
            </div>
          ))}
        </ScrollButtonsLayout>
      </div>

      {selected && (
        <DeletePilootModal
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
