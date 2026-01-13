import CheckBoxComp from "Components/HomePage/Body/Left/Common/FormComponents/CheckBoxComp";
import TextAreaComp from "Components/HomePage/Body/Left/Common/FormComponents/TextAreaComp";
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";
import { useDeletePointState } from "hooks/zustand/tools/useDeletePointState";
import useGetActiviteiten from "hooks/consts/useGetActiviteis";
import useGetOrganisaties from "hooks/consts/useGetOrganisaties";
import { useContent } from "hooks/useContent";

export default function Form() {
  const activities = useGetActiviteiten();
  const organizations = useGetOrganisaties();

  const {
    setOmschrijving,
    setHerhalen,
    setActiviteit_id,
    setOrganisatie_id,
    setSpecifiek_letten_op,
    omschrijving,
    regio_id,
    herhalen,
    vertrouwelijk,
    user_id,
    activiteit_id,
    organisatie_id,
    specifiek_letten_op,
    selectedPoint,
    xcoordinaat_rd,
    ycoordinaat_rd,
    latitude,
    longitude,
  } = useDeletePointState();

  const content = useContent();

  return (
    <div className="!space-y-3">
      <CheckBoxComp
        checked={herhalen}
        value={herhalen}
        setValue={setHerhalen}
        label={
          content.tools.aandachtspuntenVerwijderen.editPoint.labels.herhalen
        }
      />

      <div className="grid grid-cols-6 gap-x-2 items-start">
        <TextAreaComp
          value={omschrijving}
          setValue={setOmschrijving}
          label={
            content.tools.aandachtspuntenVerwijderen.editPoint.labels
              .omschrijving
          }
        />
      </div>

      <InputComp
        type="date"
        value={selectedPoint?.created_at!}
        label={content.tools.aandachtspuntenVerwijderen.editPoint.labels.datum}
        setValue={() => {}}
        disabled
      />

      <InputComp
        value={String(user_id)}
        label={
          content.tools.aandachtspuntenVerwijderen.editPoint.labels.aanmaker
        }
        setValue={() => {}}
        disabled
      />

      <InputComp
        value={regio_id}
        label={content.tools.aandachtspuntenVerwijderen.editPoint.labels.regio}
        setValue={() => {}}
        disabled
      />

      <SelectComp
        label={
          content.tools.aandachtspuntenVerwijderen.editPoint.labels.activiteit
        }
        value={activiteit_id}
        setValue={setActiviteit_id}
        options={activities}
      />

      <SelectComp
        label={
          content.tools.aandachtspuntenVerwijderen.editPoint.labels.organisatie
        }
        value={organisatie_id}
        setValue={setOrganisatie_id}
        options={organizations}
      />

      <div className="grid grid-cols-6 gap-x-2 items-start">
        <TextAreaComp
          value={specifiek_letten_op}
          setValue={setSpecifiek_letten_op}
          label={
            content.tools.aandachtspuntenVerwijderen.editPoint.labels
              .specifiekLettenOp
          }
        />
      </div>

      <InputComp
        value={`(${xcoordinaat_rd.toFixed(4)}, ${ycoordinaat_rd.toFixed(4)})`}
        label={content.tools.aandachtspuntenVerwijderen.editPoint.labels.rd}
        setValue={() => {}}
        disabled
      />

      <InputComp
        value={`(${latitude.toFixed(4)}, ${longitude.toFixed(4)})`}
        label={content.tools.aandachtspuntenVerwijderen.editPoint.labels.wgs84}
        setValue={() => {}}
        disabled
      />

      <InputComp
        value={vertrouwelijk === 1 ? "Ja" : "Nee"}
        label={
          content.tools.aandachtspuntenVerwijderen.editPoint.labels
            .vertrouwelijk
        }
        setValue={() => {}}
        disabled
      />
    </div>
  );
}
