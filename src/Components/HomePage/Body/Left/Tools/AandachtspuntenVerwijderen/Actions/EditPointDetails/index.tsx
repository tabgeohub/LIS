/* eslint-disable react-hooks/exhaustive-deps */
import { CgClose } from "react-icons/cg";
import { useEffect, useState } from "react";

import Step1 from "./Steps/Step1";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import Step2 from "./Steps/Step2";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";

export default function EditPointDetails() {
  const {
    selectedPoint,
    setOmschrijving,
    setRegio_id,
    setXCoordinaat_rd,
    setYCoordinaat_rd,
    setLatitude,
    setLongitude,
    setHerhalen,
    setVertrouwelijk,
    setUser_id,
    setActiviteit_id,
    setOrganisatie_id,
    setSpecifiek_letten_op,
  } = useDeletePointState();

  const [step, setStep] = useState(1);

  useEffect(() => {
    if (selectedPoint) {
      setOmschrijving(selectedPoint.omschrijving);
      setRegio_id(selectedPoint.regio_id);
      setXCoordinaat_rd(selectedPoint.xcoordinaat_rd);
      setYCoordinaat_rd(selectedPoint.ycoordinaat_rd);
      setLatitude(selectedPoint.latitude);
      setLongitude(selectedPoint.longitude);
      setHerhalen(selectedPoint.herhalen === 1);
      setVertrouwelijk(selectedPoint.vertrouwelijk);
      setUser_id(selectedPoint.user_id);
      setActiviteit_id(selectedPoint.activiteit_id);
      setOrganisatie_id(selectedPoint.organisatie_id);
      setSpecifiek_letten_op(selectedPoint.specifiek_letten_op);
    }
  }, [selectedPoint]);

  return (
    <div className="p-1">
      <div className="mt-2 relative">
        {step === 1 && <Step1 setStep={setStep} />}

        {step === 2 && (
          <>
            <Header title="Aandachtspunt" />

            <Step2 setStep={setStep} />
          </>
        )}
      </div>
    </div>
  );
}

function Header({ title }: { title: string }) {
  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();

  return (
    <>
      <div className="flex justify-between items-center p-1">
        <p></p>

        <p className="text-gray-400">{title}</p>

        <button
          onClick={() => {
            setSelectedTab("none");
            setSelectedBottomTab("Kaartlagenlijst");
          }}
        >
          <CgClose className="text-gray-400" />
        </button>
      </div>

      <div className="w-full h-[1px] bg-gray-200" />
    </>
  );
}
