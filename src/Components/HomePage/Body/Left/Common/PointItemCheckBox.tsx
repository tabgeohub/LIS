import { FaMapMarkedAlt } from "react-icons/fa";
import { EnrichedPointType } from "Types";
import { FinishedPointType } from "Types/finished_plans";
import { IoMdImage } from "react-icons/io";
import useGetActiviteiten from "hooks/consts/useGetActiviteis";
import useGetOrganisaties from "hooks/consts/useGetOrganisaties";

type PointType = EnrichedPointType | FinishedPointType;

export default function PointItemCheckBox({
  point,
  isSelected,
  onMouseEnter,
  onMouseLeave,
  onCheckboxClick,
  onItemClick,
  showCheckbox = true,
  variant = "default",
  showAttachments = false,
}: {
  point: PointType;
  isSelected: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onCheckboxClick?: (e: React.MouseEvent) => void;
  onItemClick?: () => void;
  showCheckbox?: boolean;
  variant?: "default" | "compact";
  showAttachments?: boolean;
}) {
  const activities = useGetActiviteiten();
  const organizations = useGetOrganisaties();

  const organizationLabel = organizations.find(
    (org) => org.value === point.organisatie_id
  )?.label;
  const activityLabel = activities.find(
    (act) => act.value === point.activiteit_id
  )?.label;

  const attachmentCount =
    "attachments" in point && Array.isArray(point.attachments)
      ? point.attachments.filter(
          (attachment) =>
            attachment !== null &&
            typeof attachment === "object" &&
            typeof (attachment as { url?: unknown }).url === "string" &&
            (attachment as { url: string }).url.length > 0
        ).length
      : 0;

  const hasAttachments =
    showAttachments &&
    "attachments" in point &&
    point.attachments &&
    attachmentCount > 0;
  const herhalenValue =
    typeof point.herhalen === "number"
      ? point.herhalen === 1
        ? "Ja"
        : "Nee"
      : point.herhalen === "1"
      ? "Ja"
      : "Nee";

  if (variant === "compact") {
    return (
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className={`p-1.5 relative ${
          isSelected ? "bg-gray-100" : "hover:bg-gray-50"
        } transition-all cursor-pointer`}
        onClick={onItemClick}
      >
        <div className="flex items-center gap-x-2">
          <FaMapMarkedAlt className="size-6 text-blue-500" />
          <p className="text-[12px]">{point.omschrijving}</p>
        </div>

        <div className="text-[10px] text-gray-500 mt-2">
          <p>Soort: "Not Added Yet"</p>
          <p>Specific letten op: {point.specifiek_letten_op}</p>
          <p>Organisatie: {organizationLabel || point.organisatie_id}</p>
          <p>Activiteit: {activityLabel || point.activiteit_id}</p>
        </div>

        {hasAttachments && (
          <div className="absolute mt-4 bottom-0 right-4">
            <IoMdImage className="size-4 text-gray-500" />
            <div className="absolute bottom-2 -right-3 bg-[#3B82F6] rounded-full px-1 text-white text-[10px]">
              {attachmentCount}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      key={point.id}
      className={`flex items-start cursor-pointer gap-x-2 py-2 my-1 px-2 transition-all duration-300 ${
        isSelected
          ? "bg-gray-200 shadow-sm rounded"
          : "hover:bg-blue-100 shadow-sm rounded"
      }`}
      onClick={onItemClick}
    >
      <div className="flex items-center gap-x-2">
        {showCheckbox && (
          <input
            checked={isSelected}
            onClick={onCheckboxClick}
            type="checkbox"
            className="size-3 cursor-pointer"
            readOnly
          />
        )}
        <FaMapMarkedAlt className="size-6 text-blue-500" />
      </div>

      <div className="flex flex-col ml-6 text-[10px]">
        <div className="flex gap-x-1 font-medium">
          <p className="text-gray-800">{point.omschrijving}</p>
        </div>

        <div className="flex gap-x-1">
          <p className="text-gray-600">Activiteit </p>
          <p className="text-gray-600">
            {activityLabel || point.activiteit_id}
          </p>
        </div>

        <div className="flex gap-x-1">
          <p className="text-gray-600">Organisatie </p>
          <p className="text-gray-600">
            {organizationLabel || point.organisatie_id}
          </p>
        </div>

        <div className="flex gap-x-1">
          <p className="text-gray-600">Letten op: </p>
          <p className="text-gray-600">{point.specifiek_letten_op}</p>
        </div>

        <div className="flex gap-x-1">
          <p className="text-gray-600">Aanmaakdatum: </p>
          <p className="text-gray-600">{point.datum}</p>
        </div>

        <div className="flex gap-x-1">
          <p className="text-gray-600">Herhalen: </p>
          <p className="text-gray-600">{herhalenValue}</p>
        </div>
      </div>
    </div>
  );
}
