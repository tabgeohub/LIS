export default function EditFormFooter({
  annulerenLabel,
  opslaanLabel,
  onCancel,
}: {
  annulerenLabel: string;
  opslaanLabel: string;
  onCancel: () => void;
}) {
  return (
    <div className="flex bg-white absolute left-0 bottom-0 items-center border-t border-gray-300 justify-end w-full gap-x-2 py-1.5 pr-3 pl-2">
      <button type="button" onClick={onCancel} className="gray-button">
        {annulerenLabel}
      </button>
      <button type="submit" className="gray-button">
        {opslaanLabel}
      </button>
    </div>
  );
}
