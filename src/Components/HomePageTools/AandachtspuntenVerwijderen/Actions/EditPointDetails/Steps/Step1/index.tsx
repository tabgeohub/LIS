import Buttons from "./Buttons";
import Form from "./Form";

export default function Step1({
  setStep,
}: {
  setStep: (value: number) => void;
}) {
  return (
    <div className="h-[65vh] overflow-y-auto thin-scrollbar flex flex-col p-2 pb-5">
      <Form />

      <Buttons setStep={setStep} />
    </div>
  );
}
