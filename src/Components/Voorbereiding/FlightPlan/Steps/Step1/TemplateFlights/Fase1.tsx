import { useContent } from "hooks/useContent";
import ImportVluchtPlan from "../ImportVluchtPlan";

export default function Fase1({
  setFase,
  setStep,
}: {
  setFase: (value: number) => void;
  setStep: (value: number) => void;
}) {
  const content = useContent();

  return (
    <div className="p-2">
      <div>{content.voorbereiding.vluchtAanmaken.step1.text1}</div>

      <div className="flex gap-x-2 mt-4 mb-6">
        <button className="gray-button" onClick={() => setFase(2)}>
          {content.voorbereiding.vluchtAanmaken.step1.vluchtenTemplate}
        </button>
        <button className="gray-button" onClick={() => setStep(3)}>
          {content.voorbereiding.vluchtAanmaken.step1.aandachtspunten}
        </button>
      </div>

      <ImportVluchtPlan />

      <div className="flex justify-end">
        <button className="gray-button" onClick={() => setStep(1)}>
          {content.common.annuleren}
        </button>
      </div>
    </div>
  );
}
