export type WizardButtonConfig = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  hidden?: boolean;
};

type WizardButtonBarProps = {
  buttons: WizardButtonConfig[];
  className?: string;
};

export default function WizardButtonBar({
  buttons,
  className = "flex justify-end gap-x-2",
}: WizardButtonBarProps) {
  const visibleButtons = buttons.filter((button) => !button.hidden);

  if (visibleButtons.length === 0) {
    return null;
  }

  if (!className) {
    return (
      <>
        {visibleButtons.map((button) => (
          <button
            key={button.label}
            type="button"
            className="gray-button"
            disabled={button.disabled}
            onClick={button.onClick}
          >
            {button.label}
          </button>
        ))}
      </>
    );
  }

  return (
    <div className={className}>
      {visibleButtons.map((button) => (
        <button
          key={button.label}
          type="button"
          className="gray-button"
          disabled={button.disabled}
          onClick={button.onClick}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
