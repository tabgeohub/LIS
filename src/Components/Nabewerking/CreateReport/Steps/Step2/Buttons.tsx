import WizardButtonBar from "Components/HomePage/Body/Common/Wizard/WizardButtonBar";
import { buildStep2WizardButtons } from "./buildStep2WizardButtons";
import { useStep2ButtonsModel } from "./useStep2ButtonsModel";

export default function Step2Buttons() {
  const model = useStep2ButtonsModel();
  return (
    <WizardButtonBar className="" buttons={buildStep2WizardButtons(model)} />
  );
}
