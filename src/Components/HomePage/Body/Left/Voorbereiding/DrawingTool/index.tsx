import Step1 from "./Step1";
import Step2 from "./Step2";
import { useDrawingStore } from "hooks/zustand/useDrawingStore";

export default function DrawingTool() {
    const { step } = useDrawingStore();

    return (
        <div>
            {step === 1 && <Step1 />}

            {step === 2 && <Step2 />}
        </div>
    );
}
