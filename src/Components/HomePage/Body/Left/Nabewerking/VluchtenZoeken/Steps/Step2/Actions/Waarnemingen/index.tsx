/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import SinglePoint from "./SinglePoint";
import { ActionType } from "../..";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useFinishedPlansState } from "hooks/zustand/nabewerking/useFinishedPlansState";
import EditPointDetails from "./EditPointDetails";
import useLogAction from "hooks/useLogAction";
import { useContent } from "hooks/useContent";

export default function Waarnemingen({
  setAction,
}: {
  setAction: (value: ActionType) => void;
}) {
  const logAction = useLogAction();

  const { selectedPlan, selectedPoint, setSelectedPoint } =
    useFinishedPlansState();

  const { setSelectedTab } = useTabState();

  const [value, setValue] = useState("");

  const [openEdit, setOpenEdit] = useState(false);

  const content = useContent();

  const filteredPoints = useMemo(() => {
    return selectedPlan?.points_data.filter((point) =>
      point.omschrijving.toLowerCase().includes(value.toLowerCase())
    );
  }, [value, openEdit]);

  useEffect(() => {
    setValue("");
  }, [openEdit]);

  return (
    <div className="h-full">
      {!openEdit && (
        <>
          <p className="text-[12px]">
            {content.nabewerking.vluchtenZoeken.step2.waarnemingen.text}
          </p>

          <ScrollButtonsLayout
            setFilterTerm={setValue}
            className="h-[93%]"
            buttons={
              <>
                <button
                  onClick={() => {
                    setAction("none");
                    setValue("");

                    logAction({
                      message: "User clicked 'Previous' button",
                      step: "Second step - Edit point",
                    });
                  }}
                  className="gray-button"
                >
                  {content.common.vorige}
                </button>

                <button
                  onClick={() => {
                    setOpenEdit(true);

                    logAction({
                      message: "User clicked 'Next' button",
                      step: "Second step - Edit point",
                    });
                  }}
                  disabled={!selectedPoint}
                  className="gray-button"
                >
                  {content.common.volgende}
                </button>

                <button
                  onClick={() => {
                    setSelectedTab("none");

                    logAction({
                      message: "User clicked 'Cancel' button",
                      step: "Second step - Edit point",
                    });
                  }}
                  className="gray-button"
                >
                  {content.common.annuleren}
                </button>
              </>
            }
          >
            <div className="divide-y-2 pb-10">
              {filteredPoints?.map((point) => (
                <SinglePoint
                  selectedPoint={selectedPoint!}
                  setSelectedPoint={setSelectedPoint}
                  point={point}
                  key={point.id}
                />
              ))}
            </div>
          </ScrollButtonsLayout>
        </>
      )}

      {openEdit && <EditPointDetails setOpenEdit={setOpenEdit} />}
    </div>
  );
}
