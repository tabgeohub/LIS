import { Range } from "react-range";

const PRIMARY_HEX = "#0070BC";

export default function TimesliderRangeTrack(input: {
  maxStep: number;
  values: number[];
  trackBackground: string;
  onChange: (values: number[]) => void;
}) {
  return (
    <div className="flex min-w-[min(100%,320px)] max-w-5xl flex-[1_1_400px] items-center px-1 sm:px-2">
      <Range
        step={1}
        min={0}
        max={input.maxStep}
        values={input.values}
        onChange={input.onChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "10px",
              width: "100%",
              borderRadius: "9999px",
              background: input.trackBackground,
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
  );
}
