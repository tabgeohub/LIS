import { useContent } from "hooks/useContent";

/**
 * Placeholder for the kaartlagen query tool.
 * Wired from the tools tab; UI content is prepared for the next feature slice.
 */
export default function Bevragen() {
  const content = useContent();
  const title = content.layout.tabHeaders.bevragen;

  return (
    <div className="p-3 text-[12px] text-gray-600" role="status">
      <p className="font-semibold text-gray-800">{title}</p>
      <p className="mt-2">
        Deze functie is nog niet beschikbaar. Gebruik de legels / kaartlagen
        panelen om lagen te bekijken.
      </p>
    </div>
  );
}
