import { useOpenTable } from "@helpers/ZustandStates/showTable";
import { useContent } from "hooks/useContent";
import { useGetFlightTimesDistance } from "hooks/useGetFlightTimesDistance";

type DetailFieldProps = {
  label: string;
  value: string | number | null | undefined;
};

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="mb-2">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium">{value ?? "-"}</div>
    </div>
  );
}

export default function Details() {
  const { flightPlanData } = useOpenTable();
  const content = useContent();
  const { beginTime, endTime, durationSeconds, totalDistance } =
    useGetFlightTimesDistance(flightPlanData ?? {});

  if (!flightPlanData) return null;

  return (
    <div className="w-full h-full p-4 overflow-y-auto">
      <div className="grid grid-cols-3 gap-6 text-sm">
        <div>
          <DetailField
            label={content.bottomSection.plansView.details.createdBy}
            value={flightPlanData.user_id}
          />
          <DetailField
            label={content.bottomSection.plansView.details.createdAt}
            value={flightPlanData.datum}
          />
          <DetailField
            label={content.bottomSection.plansView.details.flightNumber}
            value={flightPlanData.vluchtnummer}
          />
          <DetailField
            label={content.bottomSection.plansView.details.description}
            value={flightPlanData.omschrijving}
          />
          <DetailField
            label={content.bottomSection.plansView.details.observer}
            value={flightPlanData.waarnemer}
          />
          <DetailField
            label={content.bottomSection.plansView.details.pilot}
            value={flightPlanData.piloot}
          />
        </div>

        <div>
          <DetailField
            label={content.bottomSection.plansView.details.inspectionDate}
            value={flightPlanData.datum}
          />
          <DetailField
            label={content.bottomSection.plansView.details.aircraft}
            value={flightPlanData.luchtvaartuig}
          />
          <DetailField
            label={content.bottomSection.plansView.details.region}
            value={flightPlanData.regio_id}
          />
          <DetailField
            label={content.bottomSection.plansView.details.passengers}
            value={flightPlanData.passagiers}
          />
          <DetailField
            label={content.bottomSection.plansView.details.goalTheme}
            value={flightPlanData.hoofdthema}
          />
          <DetailField
            label={content.bottomSection.plansView.details.additionalInfo}
            value={flightPlanData.aanvullende}
          />
        </div>

        <div>
          <DetailField
            label={content.bottomSection.plansView.details.beginTime}
            value={beginTime}
          />
          <DetailField
            label={content.bottomSection.plansView.details.endTime}
            value={endTime}
          />
          <DetailField
            label={content.bottomSection.plansView.details.actualDuration}
            value={durationSeconds}
          />
          <DetailField
            label={content.bottomSection.plansView.details.distance}
            value={totalDistance}
          />
          <DetailField
            label={content.bottomSection.plansView.details.status}
            value={flightPlanData.status}
          />
        </div>
      </div>
    </div>
  );
}
