import LoadingBars from "Components/HomePage/Body/Common/LoadingBars";

type WizardLoadingOverlayProps = {
  show: boolean;
  variant?: "simple" | "stacked" | "offset";
};

export default function WizardLoadingOverlay({
  show,
  variant = "simple",
}: WizardLoadingOverlayProps) {
  if (!show) {
    return null;
  }

  if (variant === "stacked") {
    return (
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="relative h-full w-full">
          <div className="absolute top-0 left-0 h-full w-full bg-gray-500/20 bg-opacity-50 z-10" />
          <div className="absolute top-[30%] left-[50%] translate-x-[-50%] z-20">
            <LoadingBars />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "offset") {
    return (
      <div className="absolute h-full w-full top-10 left-0 bg-gray-100 opacity-50 z-10 flex justify-center items-center">
        <LoadingBars />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-gray-100 opacity-50 z-10 flex justify-center items-center">
      <LoadingBars />
    </div>
  );
}
