import Modal from "Components/HomePage/Body/Common/Modal";
import { useState } from "react";
import Step1 from "./Steps/Step1";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";
import { saveAs } from "file-saver";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import { IoMdClose } from "react-icons/io";
import { PDFDocument } from "pdf-lib";
import { useContent } from "hooks/useContent";

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

  const exportMap = async () => {
    setLoading(true);

    if (!mapView) {
      console.error("MapView is not initialized");
      setLoading(false);
      return;
    }

    let scale = value === "jpeg" ? 12 : 5;
    let format = value === "pdf" ? "png" : value;

    const options = {
      format: format,
      quality: 1,
      width: mapView.width * scale,
      height: mapView.height * scale,
    };

    try {
      // @ts-ignore
      const screenshot = await mapView.takeScreenshot(options);

      if (value === "PDF") {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        const imageBytes = await fetch(screenshot.dataUrl).then((res) =>
          res.arrayBuffer()
        );
        const image = await pdfDoc.embedPng(imageBytes);
        page.drawImage(image, { x: 0, y: 0, width: width, height: height });
        const pdfBytes = await pdfDoc.save();

        // @ts-ignore
        setBlob(new Blob([pdfBytes], { type: "application/pdf" }));
      } else {
        const imageBlob = await (await fetch(screenshot.dataUrl)).blob();
        setBlob(imageBlob);
      }

      setStep(2);
      setLoading(false);
    } catch (err) {
      console.error("Failed to take screenshot:", err);
    }
  };

  const downloadMap = async () => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      saveAs(blob, value === "PDF" ? "map-export.pdf" : `map-export.${value}`);
    } else {
      console.error("No data available to download.");
    }

    setTimeout(() => {
      setBlob(null);
      setStep(1);
      setOpenExporter(false);
    }, 1100);
  };

  const content = useContent();

  return (
    <>
      <Modal
        className="w-full max-w-md rounded bg-white shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
        isOpen={openExporter}
        setIsOpen={setOpenExporter}
      >
        <div className="relative">
          <div className="flex justify-between items-center px-2 py-2">
            <p className="text-gray-500 text-[16px]">
              {content.tools.exporteer.modal.title}
            </p>
            <button onClick={() => setOpenExporter(false)}>
              <IoMdClose className="text-gray-500 text-lg" />
            </button>
          </div>

          <div className="w-full h-0.5 bg-gray-300" />
          {!loading && (
            <>
              {step === 1 && (
                <Step1
                  setValue={setValue}
                  value={value}
                  setInclusief={setInclusief}
                  inclusief={inclusief}
                  exportMap={exportMap}
                />
              )}

              {step === 2 && <Step3 downloadMap={downloadMap} />}
            </>
          )}

          {loading && <Step2 />}
        </div>
      </Modal>
    </>
  );
}
