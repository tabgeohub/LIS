import { useContent } from "hooks/useContent";

type WizardHerhalenSelectButtonsProps = {
  onSelectAll: () => void;
  onSelectNone: () => void;
};

export default function WizardHerhalenSelectButtons({
  onSelectAll,
  onSelectNone,
}: WizardHerhalenSelectButtonsProps) {
  const content = useContent();

  return (
    <div className="text-[13px] flex text-blue-500 items-center gap-x-2 mt-2 font-medium">
      <button type="button" onClick={onSelectAll}>
        {content.common.selecteerAlle}
      </button>
      <div className="h-[16px] w-[1px] bg-blue-300" />
      <button type="button" onClick={onSelectNone}>
        {content.common.selecteerGeen}
      </button>
    </div>
  );
}
