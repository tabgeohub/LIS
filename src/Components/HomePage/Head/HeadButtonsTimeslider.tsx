import { Range, getTrackBackground } from "react-range";
import { useContent } from "hooks/useContent";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import "react-datepicker/dist/react-datepicker.css";
import TimesliderDateField from "./timeslider/TimesliderDateField";
import { useTimesliderRange } from "./timeslider/useTimesliderRange";

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

  const trackBackground = getTrackBackground({
    values: safeValues,
    min: 0,
    max: maxStep,
    colors: [TRACK_OUTER_HEX, PRIMARY_HEX, TRACK_OUTER_HEX],
  });

  if (loading) {
    return (
      <div className="flex w-full justify-center px-1">
        <div className="flex min-h-[88px] w-full max-w-7xl items-center justify-center rounded-lg border border-gray-200 bg-white px-6 py-2.5 shadow-sm">
          <p className="animate-pulse text-xs text-gray-400">Laden...</p>
        </div>
      </div>
    );
  }

  const invalidHint = content.layout.timeslider.invalidRangeHint;

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

          <div className="flex min-w-[min(100%,320px)] max-w-5xl flex-[1_1_400px] items-center px-1 sm:px-2">
            <Range
              step={1}
              min={0}
              max={maxStep}
              values={safeValues}
              onChange={handleSliderChange}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "10px",
                    width: "100%",
                    borderRadius: "9999px",
                    background: trackBackground,
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => {
                const { key, style, ...restProps } = props;
                return (
                  <div
                    key={key}
                    {...restProps}
                    className="transition-shadow duration-200 ease-out hover:shadow-[0_0_0_4px_rgba(0,112,188,0.22)] active:shadow-[0_0_0_3px_rgba(0,112,188,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                    style={{
                      ...style,
                      height: "20px",
                      width: "20px",
                      borderRadius: "50%",
                      backgroundColor: PRIMARY_HEX,
                      border: "2px solid white",
                      boxShadow: "0 2px 8px rgba(0, 112, 188, 0.4)",
                      outline: "none",
                    }}
                  />
                );
              }}
            />
          </div>

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
