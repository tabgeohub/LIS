import { useState } from "react";
import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";
import CheckBoxComp from "Components/HomePage/Body/Left/Common/FormComponents/CheckBoxComp";
import TextAreaComp from "Components/HomePage/Body/Left/Common/FormComponents/TextAreaComp";
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import useGetActiviteiten from "hooks/consts/useGetActiviteis";
import useGetOrganisaties from "hooks/consts/useGetOrganisaties";
import { useContent } from "hooks/useContent";
import { useDrawingStore } from "hooks/zustand/useDrawingStore";
import { useReadData } from "utils/useReadData";

export default function Step2() {
  const activities = useGetActiviteiten();
  const organizations = useGetOrganisaties();
  const content = useContent();
  const { graphicsDrawn } = useDrawingStore();

  // Form states
  const [omschrijving, setOmschrijving] = useState("");
  const [vertrouwelijk, setVertrouwelijk] = useState(false);
  const [herhalen, setHerhalen] = useState(false);
  const [activiteit, setActiviteit] = useState("");
  const [organisatie, setOrganisatie] = useState("");
  const [specifiekLettenOp, setSpecifiekLettenOp] = useState("");

  const { data: nbrOmschrijving } = useReadData(
    `/points/duplicatePoints/${omschrijving}`
  );

  return (
    <div className="max-h-[97%] p-2 overflow-y-auto thin-scrollbar">
      <div className="space-y-5 text-[16px]">
        {/* Form Fields */}
        <CheckBoxComp
          checked={vertrouwelijk}
          value={vertrouwelijk}
          setValue={setVertrouwelijk}
          label={content.voorbereiding.aandachtspuntAanmaken.step2.vertrouwelijk}
        />

        <CheckBoxComp
          checked={herhalen}
          value={herhalen}
          setValue={setHerhalen}
          label={content.voorbereiding.aandachtspuntAanmaken.step2.herhalen}
        />

        <InputComp
          label={content.voorbereiding.aandachtspuntAanmaken.step2.omschrijving}
          value={omschrijving}
          setValue={setOmschrijving}
          required={true}
        />

        {Number(nbrOmschrijving) > 0 && omschrijving !== "" && (
          <div className="flex flex-col items-end">
            <p className="text-red-500 text-xs">
              {content.voorbereiding.aandachtspuntAanmaken.step3
                .omschrijvingWarning}
            </p>
          </div>
        )}

        <SelectComp
          label={content.voorbereiding.aandachtspuntAanmaken.step2.activiteit}
          value={activiteit}
          setValue={setActiviteit}
          options={activities}
        />

        <SelectComp
          label={content.voorbereiding.aandachtspuntAanmaken.step2.organisatie}
          value={organisatie}
          setValue={setOrganisatie}
          options={organizations}
          required
        />

        <div className="grid grid-cols-6 gap-x-2 items-start">
          <TextAreaComp
            value={specifiekLettenOp}
            setValue={setSpecifiekLettenOp}
            label={
              content.voorbereiding.aandachtspuntAanmaken.step2.specifiekLettenOp
            }
          />
        </div>
      </div>
    </div>
  );
}








// {/* Display Drawn Points */}
// {graphicsDrawn && graphicsDrawn.length > 0 && (
//   <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
//     <h4 className="text-sm font-semibold text-gray-800 mb-3">
//       Getekende vormen:
//     </h4>
//     <div className="space-y-3">
//       {graphicsDrawn.map((shape, index) => (
//         <div
//           key={index}
//           className="p-3 bg-white rounded border border-gray-200"
//         >
//           <div className="flex items-center gap-2 mb-2">
//             <span className="text-xs font-semibold text-primary capitalize">
//               {shape.type} {index + 1}
//             </span>
//           </div>
//           <div className="text-xs text-gray-600 space-y-1">
//             {shape.points.map((point, pointIndex) => (
//               <div key={pointIndex} className="flex gap-2">
//                 <span className="font-mono">
//                   Punt {pointIndex + 1}:
//                 </span>
//                 <span>
//                   [{point[0].toFixed(6)}, {point[1].toFixed(6)}]
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   </div>
// )}