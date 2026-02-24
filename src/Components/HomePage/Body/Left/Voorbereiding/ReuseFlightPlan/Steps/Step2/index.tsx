import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";
import Buttons from "./Buttons";
import CurrentPointsList from "./CurrentPointsList";
import CurrentGeometriesList from "./CurrentGeometriesList";
import FormInputs from "./FormInputs";
import NewPointsList from "./NewPointsList";
import NewGeometriesList from "./NewGeometriesList";

export default function Step2() {
  return (
    <ScrollButtonsLayout buttons={<Buttons />}>
      <FormInputs />

      <CurrentGeometriesList />
      <CurrentPointsList />

      <NewGeometriesList />
      <NewPointsList />
    </ScrollButtonsLayout>
  );
}
