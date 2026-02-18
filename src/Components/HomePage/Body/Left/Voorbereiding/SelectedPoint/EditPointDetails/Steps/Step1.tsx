import { Field, useFormikContext } from "formik";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { usePopUpState } from "@helpers/ZustandStates/popUpState";
import { CgSpinner } from "react-icons/cg";
import InputFormik from "../../Common/InputFormik";
import SelectFormik from "../../Common/SelectFormik";
import { EnrichedPointType } from "Types";
import { useUpdateData } from "utils/useUpdateData";
import { usePointsStore } from "hooks/features/usePointsStore";
import useLogAction from "hooks/useLogAction";
import useGetActiviteiten from "hooks/consts/useGetActiviteis";
import useGetOrganisaties from "hooks/consts/useGetOrganisaties";
import { useAuth } from "@helpers/ZustandStates/useAuth";

export default function Step1({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  const logAction = useLogAction();
  const organizations = useGetOrganisaties();

  const activities = useGetActiviteiten();

  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();
  const { clickedPoint } = usePopUpState();

  const { update, loading } = useUpdateData(`/points/${clickedPoint?.id}`);
  const { setPoints, dbPoints, fetchDBPoints, fetchPoints } = usePointsStore();

  function handleClose() {
    setSelectedBottomTab("Kaartlagenlijst");
    setSelectedTab("none");

    logAction({
      message: "User clicked 'Cancel' button",
      step: "Edit point details - Step 1",
    });
  }

  const { values } = useFormikContext();

  const { user } = useAuth();

  function handleSubmit(values: EnrichedPointType) {
    const attributes = {
      omschrijving: values.omschrijving,
      regio_id: values.regio_id,
      xcoordinaat_rd: values.xcoordinaat_rd,
      ycoordinaat_rd: values.ycoordinaat_rd,
      latitude: values.latitude,
      longitude: values.longitude,
      vertrouwelijk: values.vertrouwelijk,
      herhalen: values.herhalen,
      user_id: values.user_id,
      activiteit_id: values.activiteit_id,
      organisatie_id: values.organisatie_id,
      specifiek_letten_op: values.specifiek_letten_op,
      datum: values.created_at,
      id: values.id,
    };

    update(attributes, (responseData) => {
      if (!responseData.result) return;

      fetchDBPoints({
        regio: user?.role,
      });

      fetchPoints({
        regio: user?.role,
      });

      setPoints(dbPoints);
      setSelectedBottomTab("viewSelectedPointDetails");
    });

    logAction({
      message: "User clicked 'Save' button to edit a point",
      step: "Edit point details - Step 2",
      newData: {
        omschrijving: values.omschrijving,
        regio_id: values.regio_id,
        xcoordinaat_rd: values.xcoordinaat_rd,
        ycoordinaat_rd: values.ycoordinaat_rd,
        latitude: values.latitude,
        longitude: values.longitude,
        vertrouwelijk: values.vertrouwelijk,
        herhalen: values.herhalen,
        user_id: values.user_id,
        activiteit_id: values.activiteit_id,
        organisatie_id: values.organisatie_id,
        specifiek_letten_op: values.specifiek_letten_op,
      },
    });
  }

  return (
    <div className="h-[65vh] overflow-y-auto thin-scrollbar flex flex-col gap-y-2 p-2">
      <div className="flex gap-x-2 items-center">
        <Field name="herhalen" type="checkbox" placeholder="herhalen" />

        <label htmlFor="herhalen">Herhalen</label>
      </div>

      <InputFormik label="Omschrijving" name="omschrijving" />

      <InputFormik
        disabled={true}
        label="Datum"
        name="datum"
        type="datetime-local"
      />

      <InputFormik disabled={true} label="Aanmaker" name="aanmaker" />

      <InputFormik disabled={true} label="Regio" name="regio_id" />

      <SelectFormik
        label="Activiteit"
        name="activiteit_id"
        options={activities}
      />

      <SelectFormik
        label="Organisatie"
        name="organisatie_id"
        options={organizations}
      />

      <InputFormik
        label="Specifiek letten op"
        name="specifiek_letten_op"
        type="textarea"
      />

      <InputFormik disabled={true} label="RD (X, Y)" name="rd" />

      <InputFormik disabled={true} label="WGS84 (Lat, Lon)" name="wgs84" />

      <InputFormik disabled={true} label="Vertrouwelijk" name="vertrouwelijk" />

      <div className="flex justify-end gap-x-1 text-[12px] mt-6">
        <button className="gray-button">Verwijderen</button>

        <button
          onClick={() => {
            setStep(2);
            // setCreateNewPoint(true);

            logAction({
              message: "User clicked 'Geometry change' button",
              step: "Edit point details - Step 1",
            });
          }}
          className="gray-button"
        >
          Geometrie aanpassen
        </button>

        <button
          onClick={() => {
            handleSubmit(values as EnrichedPointType);

            logAction({
              message: "User clicked 'Save' button",
              step: "Edit point details - Step 1",
            });
          }}
          className="gray-button"
        >
          Opslaan
        </button>

        <button className="gray-button" type="button" onClick={handleClose}>
          Annuleren
        </button>
      </div>

      {loading && (
        <div className="absolute h-full w-full top-0 left-0 bg-gray-100 opacity-50 z-10 flex justify-center items-center">
          <div className="flex flex-col items-center justify-center">
            <CgSpinner className="animate-spin text-blue-500 text-6xl" />
            <p className="text-gray-500 text-sm">Bezig met opslaan...</p>
          </div>
        </div>
      )}
    </div>
  );
}
