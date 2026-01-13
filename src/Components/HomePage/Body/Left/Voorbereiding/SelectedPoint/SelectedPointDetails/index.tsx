import {
  initialPointState,
  usePopUpState,
} from "@helpers/ZustandStates/popUpState";
import { useTabState } from "@helpers/ZustandStates/tabState";
import { useSelectedBottomTabState } from "@helpers/ZustandStates/selectedBottomTabState";
import { CgClose } from "react-icons/cg";
import useLogAction from "hooks/useLogAction";
import useGetActiviteiten from "hooks/consts/useGetActiviteis";
import useGetOrganisaties from "hooks/consts/useGetOrganisaties";
import { useContent } from "hooks/useContent";

export default function SelectedPointDetails() {
  const logAction = useLogAction();
  const organizations = useGetOrganisaties();

  const activities = useGetActiviteiten();

  const { setClickedPointId, clickedPoint, setClickedPoint } = usePopUpState();
  const { setSelectedTab } = useTabState();
  const { setSelectedBottomTab } = useSelectedBottomTabState();

  const details = [
    {
      label: "Omschrijving",
      value: clickedPoint?.omschrijving,
    },
    {
      label: "Regio",
      value: clickedPoint?.regio_id,
    },
    {
      label: "X-coordinaat",
      value: clickedPoint?.xcoordinaat_rd,
    },
    {
      label: "Y-coordinaat",
      value: clickedPoint?.ycoordinaat_rd,
    },
    {
      label: "Latitude",
      value: clickedPoint?.latitude,
    },
    {
      label: "Longitude",
      value: clickedPoint?.longitude,
    },
    {
      label: "Herhalen",
      value: clickedPoint?.herhalen === 1 ? "Ja" : "Nee",
    },
    {
      label: "Vertrouwelijk",
      value: clickedPoint?.vertrouwelijk === 1 ? "Ja" : "Nee",
    },
    {
      label: "Indiener",
      value: clickedPoint?.user_id,
    },
    {
      label: "Activiteit",
      value:
        activities.find(
          (activity) => activity.value === clickedPoint?.activiteit_id
        )?.label || "",
    },
    {
      label: "Organisatie",
      value:
        organizations.find(
          (organization) => organization.value === clickedPoint?.organisatie_id
        )?.label || "",
    },
    {
      label: "Specifiek letten op",
      value: clickedPoint?.specifiek_letten_op,
    },
    {
      label: "Datum",
      value: clickedPoint.datum,
    },
  ];

  function handleClose() {
    setSelectedBottomTab("Kaartlagenlijst");
    setSelectedTab("none");

    setClickedPointId(0);
    setClickedPoint(initialPointState);

    logAction({
      message: "User clicked close icon",
      step: "Selected point details",
    });
  }

  const content = useContent();

  return (
    <div className="p-3">
      <div className="flex justify-between items-center">
        <p className="text-lg text-gray-500">Beschrijving</p>

        <button onClick={handleClose}>
          <CgClose className="text-gray-400" />
        </button>
      </div>

      <div className="text-blue-500 text-xs font-medium mt-4">
        <span
          onClick={() => {
            setSelectedBottomTab("editSelectedPoint");

            logAction({
              message: "User clicked 'Aandachtspunt wijzigen' button",
              step: "Selected point details",
            });
          }}
          className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
        >
          {content.bottomSection.editPointTabs.editPoint}
        </span>

        <span className="mx-2">-</span>

        <span
          onClick={() => {
            setSelectedBottomTab("deletePoint");

            logAction({
              message: "User clicked 'Delete point' button",
              step: "Selected point details",
            });
          }}
          className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
        >
          {content.bottomSection.editPointTabs.deletePoint}
        </span>

        <span className="mx-2">-</span>

        <span
          onClick={() => {
            setSelectedBottomTab("viewPlans");

            logAction({
              message: "User clicked 'View plans' button",
              step: "Selected point details",
            });
          }}
          className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
        >
          {content.bottomSection.editPointTabs.viewObservations}
        </span>

        <span className="mx-2">-</span>

        <span
          onClick={() => {
            setSelectedBottomTab("addToPlan");

            logAction({
              message: "User clicked 'Add to plan' button",
              step: "Selected point details",
            });
          }}
          className="cursor-pointer hover:text-blue-600 hover:underline hover:font-semibold transition-all"
        >
          {content.bottomSection.editPointTabs.addToPlan}
        </span>
      </div>

      <p className="text-lg text-gray-500 my-2">
        {content.bottomSection.editPointTabs.details}
      </p>

      <div className="h-[50vh] overflow-y-scroll thin-scrollbar">
        {details.at(0)?.value &&
          details.map((detail, index) => (
            <div key={index} className="mt-3 -space-y-1">
              <p className="text-xs text-gray-500 font-medium">
                {detail.label}
              </p>
              <p className="text-base text-gray-700">{detail.value}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
