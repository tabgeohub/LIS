import AandachtspuntDetailsFields from "Components/HomePage/Body/Left/Common/AandachtspuntDetailsFields";
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import TextAreaComp from "Components/HomePage/Body/Left/Common/FormComponents/TextAreaComp";
import { useContent } from "hooks/useContent";
import {
  pickDeletePointFormFields,
  useDeletePointState,
} from "hooks/zustand/tools/useDeletePointState";

export default function Form() {
  const content = useContent();
  const labels = content.tools.aandachtspuntenVerwijderen.editPoint.labels;

  const {
    setOmschrijving,
    setHerhalen,
    setActiviteit_id,
    setOrganisatie_id,
    setSpecifiek_letten_op,
    setVertrouwelijk,
    selectedPoint,
  } = useDeletePointState();

  const {
    omschrijving,
    regio_id,
    herhalen,
    vertrouwelijk,
    user_id,
    activiteit_id,
    organisatie_id,
    specifiek_letten_op,
    xcoordinaat_rd,
    ycoordinaat_rd,
    latitude,
    longitude,
  } = useDeletePointState(pickDeletePointFormFields);

  return (
    <AandachtspuntDetailsFields
      className="!space-y-3"
      hideVertrouwelijk
      vertrouwelijk={vertrouwelijk === 1}
      setVertrouwelijk={(value) => setVertrouwelijk(value ? 1 : 0)}
      herhalen={herhalen}
      setHerhalen={setHerhalen}
      activiteit={activiteit_id}
      setActiviteit={setActiviteit_id}
      organisatie={organisatie_id}
      setOrganisatie={setOrganisatie_id}
      specifiekLettenOp={specifiek_letten_op}
      setSpecifiekLettenOp={setSpecifiek_letten_op}
      labels={{
        herhalen: labels.herhalen,
        activiteit: labels.activiteit,
        organisatie: labels.organisatie,
        specifiekLettenOp: labels.specifiekLettenOp,
      }}
      omschrijvingField={
        <div className="grid grid-cols-6 gap-x-2 items-start">
          <TextAreaComp
            value={omschrijving}
            setValue={setOmschrijving}
            label={labels.omschrijving}
          />
        </div>
      }
      fieldsAfterOmschrijving={
        <>
          <InputComp
            type="date"
            value={selectedPoint?.created_at!}
            label={labels.datum}
            setValue={() => {}}
            disabled
          />

          <InputComp
            value={String(user_id)}
            label={labels.aanmaker}
            setValue={() => {}}
            disabled
          />

          <InputComp
            value={regio_id}
            label={labels.regio}
            setValue={() => {}}
            disabled
          />
        </>
      }
      trailingFields={
        <>
          <InputComp
            value={`(${xcoordinaat_rd.toFixed(4)}, ${ycoordinaat_rd.toFixed(4)})`}
            label={labels.rd}
            setValue={() => {}}
            disabled
          />

          <InputComp
            value={`(${latitude.toFixed(4)}, ${longitude.toFixed(4)})`}
            label={labels.wgs84}
            setValue={() => {}}
            disabled
          />

          <InputComp
            value={vertrouwelijk === 1 ? "Ja" : "Nee"}
            label={labels.vertrouwelijk}
            setValue={() => {}}
            disabled
          />
        </>
      }
    />
  );
}
