import { FaExternalLinkAlt } from "react-icons/fa";
import { LuSquareChevronDown } from "react-icons/lu";

export default function SelectedPlanRowActions({
  onGoTo,
  onDropdownClick,
  accordionOpen = false,
  goToTitle = "Ga naar op de kaart",
  dropdownTitle = "Toon of verberg afbeeldingen",
}: {
  onGoTo: () => void;
  onDropdownClick?: () => void;
  accordionOpen?: boolean;
  goToTitle?: string;
  dropdownTitle?: string;
}) {
  return (
    <div className="ml-auto flex shrink-0 items-center gap-0.5 self-start pt-0.5">
      <button
        type="button"
        title={goToTitle}
        aria-label={goToTitle}
        onClick={(e) => {
          e.stopPropagation();
          onGoTo();
        }}
        className="rounded p-1 text-primary transition-colors hover:bg-primary/10 hover:text-primary"
      >
        <FaExternalLinkAlt className="size-3.5" />
      </button>
      <button
        type="button"
        title={dropdownTitle}
        aria-label={dropdownTitle}
        aria-expanded={accordionOpen}
        onClick={(e) => {
          e.stopPropagation();
          onDropdownClick?.();
        }}
        className="rounded p-1 text-primary transition-colors hover:bg-primary/10 hover:text-primary"
      >
        <LuSquareChevronDown
          className={`size-[1.125rem] transition-transform duration-200 ease-out ${
            accordionOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
}
