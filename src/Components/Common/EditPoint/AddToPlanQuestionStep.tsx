export default function AddToPlanQuestionStep({
  question,
  yesLabel,
  noLabel,
  nextLabel,
  cancelLabel,
  answer,
  onAnswerChange,
  onNext,
  onCancel,
  radioName = "addToPlan",
}: {
  question: string;
  yesLabel: string;
  noLabel: string;
  nextLabel: string;
  cancelLabel: string;
  answer: string;
  onAnswerChange: (value: "radio1" | "radio2") => void;
  onNext: () => void;
  onCancel: () => void;
  radioName?: string;
}) {
  const yesId = `${radioName}-yes`;
  const noId = `${radioName}-no`;

  return (
    <div className="p-2">
      <p className="text-[12px]">{question}</p>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-x-2 text-sm">
          <input
            onClick={() => onAnswerChange("radio1")}
            checked={answer === "radio1"}
            type="radio"
            id={yesId}
            name={radioName}
          />
          <label htmlFor={yesId}>{yesLabel}</label>
        </div>

        <div className="flex items-center gap-x-2 text-sm">
          <input
            onClick={() => onAnswerChange("radio2")}
            checked={answer === "radio2"}
            type="radio"
            id={noId}
            name={radioName}
          />
          <label htmlFor={noId}>{noLabel}</label>
        </div>
      </div>

      <div className="flex justify-end gap-x-1 text-[12px] mt-6">
        <button onClick={onNext} className="gray-button">
          {nextLabel}
        </button>

        <button onClick={onCancel} className="gray-button">
          {cancelLabel}
        </button>
      </div>
    </div>
  );
}
