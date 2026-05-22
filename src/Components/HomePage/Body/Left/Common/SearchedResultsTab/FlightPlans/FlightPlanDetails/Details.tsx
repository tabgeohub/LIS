import { useGetFlightTimesDistance } from "hooks/useGetFlightTimesDistance";
import { FlightPlanType } from "Types";

export default function Details({
  flightPlan,
}: {
  flightPlan: FlightPlanType;
}) {
  const { beginTime, endTime, durationSeconds, totalDistance } =
    useGetFlightTimesDistance(flightPlan);

  if (!flightPlan) return null;

  return (
    <div className="space-y-2 px-2 h-[65vh] overflow-y-scroll">
      <div className="py-2">Details</div>

      <div>
        <p className="text-gray-500 text-sm">Aanmaker vliegplan</p>
        <p className="text-md">
          {flightPlan?.waarnemer ? flightPlan?.waarnemer : "-"}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Aanmaakdatum</p>
        <p className="text-sm">
          {flightPlan?.datum ? formatDate(flightPlan?.datum) : "-"}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Vluchtnummer</p>
        <p className="text-sm">
          {flightPlan?.vluchtnummer ? flightPlan?.vluchtnummer : "-"}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Waarnemer</p>
        <p className="text-sm">
          {flightPlan?.waarnemer ? flightPlan?.waarnemer : "-"}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Piloot</p>
        <p className="text-sm">
          {flightPlan?.piloot ? flightPlan?.piloot : "-"}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Inspectiedatum</p>
        <p className="text-sm">{flightPlan?.datum ? flightPlan?.datum : "-"}</p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">luchtvaartuig</p>
        <p className="text-sm">
          {flightPlan?.luchtvaartuig ? flightPlan?.luchtvaartuig : "-"}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Regio</p>
        <p className="text-sm">
          {flightPlan?.regio_id ? flightPlan?.regio_id : "-"}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Aantal passagiers</p>
        <p className="text-sm">
          {flightPlan?.passagiers ? flightPlan?.passagiers : "-"}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Doel en hoofdthema</p>
        <p className="text-sm">
          {flightPlan?.hoofdthema ? flightPlan?.hoofdthema : "-"}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Aanvullende informatie</p>
        <p className="text-sm">
          {flightPlan?.aanvullende ? flightPlan?.aanvullende : "-"}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Geplande vliegduur</p>
        <p className="text-sm">
          {flightPlan?.geplandeVliegduur ? flightPlan?.geplandeVliegduur : "-"}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Begintijd en datum</p>
        <p className="text-sm">{beginTime ? beginTime : "-"}</p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Eindtijd en datum</p>
        <p className="text-sm">{endTime ? endTime : "-"}</p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Werkelijke vliegduur</p>
        <p className="text-sm">{durationSeconds ? durationSeconds : "-"}</p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Gevlogen afstand</p>
        <p className="text-sm">
          {typeof totalDistance === "number"
            ? `${totalDistance.toFixed(4)} m`
            : "-"}
        </p>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Status</p>
        <p className="text-sm">
          {flightPlan?.status ? flightPlan?.status : "-"}
        </p>
      </div>
    </div>
  );
}

function formatDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;

  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}
