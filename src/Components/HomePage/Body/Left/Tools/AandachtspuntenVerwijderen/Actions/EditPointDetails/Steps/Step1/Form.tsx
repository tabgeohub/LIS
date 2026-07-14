import AandachtspuntDetailsFields from "Components/HomePage/Body/Left/Common/AandachtspuntDetailsFields";
import TextAreaComp from "Components/HomePage/Body/Left/Common/FormComponents/TextAreaComp";
import { useContent } from "hooks/useContent";
import {
  pickDeletePointFormFields,
  useDeletePointState,
} from "hooks/zustand/tools/useDeletePointState";
import { ReadOnlyPointCoordinates, ReadOnlyPointFields } from "./ReadOnlyPointFields";

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
        <ReadOnlyPointFields values={{ createdAt: selectedPoint?.created_at!, userId: user_id, regioId: regio_id }} labels={labels} />
      }
      trailingFields={
        <ReadOnlyPointCoordinates values={{ x: xcoordinaat_rd, y: ycoordinaat_rd, latitude, longitude, confidential: vertrouwelijk === 1 }} labels={labels} />
      }
    />
  );
}
