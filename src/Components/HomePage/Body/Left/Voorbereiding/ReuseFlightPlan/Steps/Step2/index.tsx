import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import CurrentPointsList from "./CurrentPointsList";
import FormInputs from "./FormInputs";
import NewPointsList from "./NewPointsList";

export default function Step2() {
  return (
    <ScrollButtonsLayout buttons={<Buttons />}>
      <FormInputs />

      <CurrentPointsList />

      <NewPointsList />
    </ScrollButtonsLayout>
  );
}
