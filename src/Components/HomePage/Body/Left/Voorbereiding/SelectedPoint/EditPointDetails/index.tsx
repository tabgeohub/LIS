import { CgClose } from "react-icons/cg";
import { useEffect, useState } from "react";

import { usePopUpState } from "@helpers/ZustandStates/popUpState";

import Step1 from "./Steps/Step1";
import { Form, Formik } from "formik";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import Step2 from "./Steps/Step2";
import { EnrichedPointType } from "Types";
import useLogAction from "hooks/useLogAction";

export default function EditPointDetails() {
  const { clickedPointId, clickedPoint } = usePopUpState();

  const [step, setStep] = useState(1);

  const [formValues, setFormValues] = useState<EnrichedPointType>();

  useEffect(() => {
    const newInitialValues: EnrichedPointType = {
      id: clickedPointId !== 0 ? clickedPointId : 0,
      herhalen: clickedPoint.herhalen,
      omschrijving: clickedPoint.omschrijving,
      datum: clickedPoint.datum,
      aanmaker: clickedPoint.aanmaker,
      regio_id: clickedPoint.regio_id,
      activiteit_id: clickedPoint.activiteit_id,
      organisatie_id: clickedPoint.organisatie_id,
      specifiek_letten_op: clickedPoint.specifiek_letten_op,
      vertrouwelijk: clickedPoint.vertrouwelijk,
      xcoordinaat_rd: clickedPoint.xcoordinaat_rd,
      ycoordinaat_rd: clickedPoint.ycoordinaat_rd,
      longitude: clickedPoint.longitude,
      latitude: clickedPoint.latitude,
      user_id: clickedPoint.user_id,
      Point_description: clickedPoint.Point_description,
      region: clickedPoint.region,
      created_at: clickedPoint.created_at,
    };

    setFormValues(newInitialValues);
  }, [clickedPointId, clickedPoint]);

  return (
    <div className="p-1">
      <Formik
        initialValues={{
          ...formValues,
          coordinateSystem: "RD",
          x: clickedPoint.xcoordinaat_rd,
          y: clickedPoint.ycoordinaat_rd,
          rd: `( ${clickedPoint.xcoordinaat_rd.toFixed(
            2
          )} , ${clickedPoint.ycoordinaat_rd.toFixed(2)} )`,
          wgs84: `( ${clickedPoint.latitude.toFixed(
            2
          )} , ${clickedPoint.longitude.toFixed(2)} )`,
        }}
        onSubmit={() => {}}
        enableReinitialize
      >
        <Form className="mt-2 relative">
          {step === 1 && (
            <>
              <Header title="Aandachtspunt wijzigen" />

              <Step1 setStep={setStep} />
            </>
          )}

          {step === 2 && (
            <>
              <Header title="Aandachtspunt" />

              <Step2 setStep={setStep} />
            </>
          )}
        </Form>
      </Formik>
    </div>
  );
}

function Header({ title }: { title: string }) {
  const logAction = useLogAction();

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

            logAction({
              message: "User clicked close icon",
              step: "Edit point details",
            });
          }}
        >
          <CgClose className="text-gray-400" />
        </button>
      </div>

      <div className="w-full h-[1px] bg-gray-200" />
    </>
  );
}
