import { useContent } from "hooks/useContent";
import {
  pickDeletePointFormFields,
  useDeletePointState,
} from "Components/HomePageTools/AandachtspuntenVerwijderen/state/useDeletePointState";

export function useDeletePointStep1FormModel() {
  const content = useContent();
  const labels = content.tools.aandachtspuntenVerwijderen.editPoint.labels;
  const setters = useDeletePointState();
  const fields = useDeletePointState(pickDeletePointFormFields);
  return {
    labels,
    selectedPoint: setters.selectedPoint,
    setOmschrijving: setters.setOmschrijving,
    setHerhalen: setters.setHerhalen,
    setActiviteit_id: setters.setActiviteit_id,
    setOrganisatie_id: setters.setOrganisatie_id,
    setSpecifiek_letten_op: setters.setSpecifiek_letten_op,
    setVertrouwelijk: setters.setVertrouwelijk,
    ...fields,
  };
}
