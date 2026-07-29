type Action = { label: string; onClick: () => void };

export function SelectedPointActions({ actions }: { actions: Action[] }) {
  return (
    <div className="text-blue-500 text-xs font-medium mt-4">
      {actions.map((action, index) => (
        <span key={action.label}>
          {index > 0 && <span className="mx-2">-</span>}
          <span
            onClick={action.onClick}
            className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
          >
            {action.label}
          </span>
        </span>
      ))}
    </div>
  );
}
