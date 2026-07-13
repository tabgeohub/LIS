import { getTrackBackground } from "react-range";
import { useContent } from "hooks/useContent";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import "react-datepicker/dist/react-datepicker.css";
import TimesliderDateField from "./timeslider/TimesliderDateField";
import { useTimesliderRange } from "./timeslider/useTimesliderRange";
import { TimesliderLoadingShell } from "./timeslider/TimesliderLoadingShell";
import TimesliderRangeTrack from "./timeslider/TimesliderRangeTrack";

const PRIMARY_HEX = "#0070BC";
const TRACK_OUTER_HEX = "#e5e7eb";

export default function HeadButtonsTimeslider() {
  const content = useContent();
  const { user } = useAuth();
  const regioId = user?.role || undefined;

  const {
    loading,
    maxStep,
    safeValues,
    dateFrom,
    dateTo,
    orderHint,
    handleSliderChange,
    handleFromChange,
    handleToChange,
  } = useTimesliderRange(regioId);

  if (loading) {
    return <TimesliderLoadingShell />;
  }

  const invalidHint = content.layout.timeslider.invalidRangeHint;
  const trackBackground = getTrackBackground({
    values: safeValues,
    min: 0,
    max: maxStep,
    colors: [TRACK_OUTER_HEX, PRIMARY_HEX, TRACK_OUTER_HEX],
  });

  return (
    <div className="flex w-full justify-center px-1">
      <div className="flex min-h-[88px] w-full max-w-7xl items-center rounded-lg border border-gray-200 bg-white px-6 py-2.5 shadow-sm">
        <div className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <TimesliderDateField
            variant="from"
            label={content.layout.timeslider.van}
            selected={dateFrom}
            onChange={(date) => handleFromChange(date, invalidHint)}
          />

          <TimesliderRangeTrack
            maxStep={maxStep}
            values={safeValues}
            trackBackground={trackBackground}
            onChange={handleSliderChange}
          />

          <div className="flex shrink-0 flex-col items-end gap-0.5">
            <TimesliderDateField
              variant="to"
              label={content.layout.timeslider.tot}
              selected={dateTo}
              onChange={(date) => handleToChange(date, invalidHint)}
            />
            {orderHint ? (
              <p
                className="max-w-[220px] text-right text-[10px] font-medium leading-tight text-red-600"
                role="status"
              >
                {orderHint}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
