import Modal from "Components/Common/Modal";
import ConfirmModalChrome from "Components/Common/ConfirmModalChrome";
import { renderWizardStep } from "Components/Common/Wizard/renderWizardStep";
import { useState } from "react";
import Step1 from "./Steps/Step1";
import { useMapViewState } from "hooks/zustand/ui";
import { saveAs } from "file-saver";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import { useContent } from "hooks/useContent";
import { takeMapScreenshotBlob } from "./takeMapScreenshotBlob";

export default function Exporter({
  openExporter,
  setOpenExporter,
}: {
  openExporter: boolean;
  setOpenExporter: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { mapView } = useMapViewState();
  const [value, setValue] = useState("png");
  const [inclusief, setInclusief] = useState(false);
  const [step, setStep] = useState(1);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const content = useContent();

  const exportMap = async () => {
    setLoading(true);
    if (!mapView) {
      console.error("MapView is not initialized");
      setLoading(false);
      return;
    }
    try {
      setBlob(await takeMapScreenshotBlob(mapView, value));
      setStep(2);
      setLoading(false);
    } catch (err) {
      console.error("Failed to take screenshot:", err);
      setLoading(false);
    }
  };

  const downloadMap = async () => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      saveAs(
        blob,
        value.toLowerCase() === "pdf" ? "map-export.pdf" : `map-export.${value}`
      );
    } else {
      console.error("No data available to download.");
    }
    setTimeout(() => {
      setBlob(null);
      setStep(1);
      setOpenExporter(false);
    }, 1100);
  };

  return (
    <Modal
      className="w-full max-w-md rounded bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
      isOpen={openExporter}
      setIsOpen={setOpenExporter}
    >
      <ConfirmModalChrome
        title={content.tools.exporteer.modal.title}
        onClose={() => setOpenExporter(false)}
      >
        {loading
          ? <Step2 />
          : renderWizardStep(step, {
              1: (
                <Step1
                  setValue={setValue}
                  value={value}
                  setInclusief={setInclusief}
                  inclusief={inclusief}
                  exportMap={exportMap}
                />
              ),
              2: <Step3 downloadMap={downloadMap} />,
            })}
      </ConfirmModalChrome>
    </Modal>
  );
}
