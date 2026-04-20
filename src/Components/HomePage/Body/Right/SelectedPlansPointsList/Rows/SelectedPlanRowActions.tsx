import { FaExternalLinkAlt } from "react-icons/fa";
import { LuSquareChevronDown } from "react-icons/lu";

export default function SelectedPlanRowActions({
  detailHref,
  onDropdownClick,
  accordionOpen = false,
  externalLinkTitle = "Open details in nieuw tabblad",
  dropdownTitle = "Toon of verberg afbeeldingen",
}: {
  detailHref: string;
  onDropdownClick?: () => void;
  accordionOpen?: boolean;
  externalLinkTitle?: string;
  dropdownTitle?: string;
}) {
  return (
    <div className="ml-auto flex shrink-0 items-center gap-0.5 self-start pt-0.5">
      <a
        href={detailHref}
        target="_blank"
        rel="noopener noreferrer"
        title={externalLinkTitle}
        aria-label={externalLinkTitle}
        onClick={(e) => e.stopPropagation()}
        className="rounded p-1 text-primary transition-colors hover:bg-primary/10 hover:text-primary"
      >
        <FaExternalLinkAlt className="size-3.5" />
      </a>
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
