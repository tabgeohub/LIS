import { useContent } from "hooks/useContent";
import { FaMapMarkedAlt } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { LuWaypoints } from "react-icons/lu";
import { FlightPlanTemplate } from ".";
import { useMemo, useState } from "react";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";

export default function Fase2({
  setFase,
  flightTemplate,
  setSelectedTemplate,
}: {
  setFase: (value: number) => void;
  flightTemplate: FlightPlanTemplate[];
  setSelectedTemplate: (value: any) => void;
}) {
  const [filterTerm, setFilterTerm] = useState("");

  const handleNext = (plan) => {
    setFase(3);

    setSelectedTemplate(plan);
  };

  const content = useContent();

  const filteredTemplates = useMemo(() => {
    return flightTemplate?.filter((plan) =>
      plan.name.toLowerCase().includes(filterTerm.toLowerCase())
    );
  }, [flightTemplate, filterTerm]);

  return (
    <ScrollButtonsLayout
      buttons={
        <>
          <button className="gray-button" onClick={() => setFase(1)}>
            {content.common.vorige}
          </button>
        </>
      }
      className="h-[100%]"
    >
      <div className="w-full p-2">
        <input
          className="inputClass"
          type="text"
          placeholder="Zoek naar een template"
          value={filterTerm}
          onChange={(e) => setFilterTerm(e.target.value)}
        />
      </div>

      {filteredTemplates?.length === 0 && (
        <div className="text-center mt-2">
          <p className="text-gray-800">
            {content.voorbereiding.vluchtAanmaken.step1.text2}
          </p>
        </div>
      )}

      <div>
        {filteredTemplates?.map((plan, index) => (
          <div
            key={index}
            className="flex justify-between p-2 text-sm text-gray-400 border-b border-gray-200 cursor-pointer hover:bg-blue-100"
            onClick={() => handleNext(plan)}
          >
            <div>
              <div className="flex gap-x-1">
                <FaMapMarkedAlt className="mt-[2px] text-lg text-blue-400" />
                <div>
                  <p className="text-gray-800 pl-2 mb-2">{plan.name}</p>
                  <div className="flex items-center gap-x-1 text-gray-600">
                    <span>
                      {plan.points.length}{" "}
                      {plan.points.length === 1 ? "Punt" : "Punten"}
                    </span>
                    <LuWaypoints className="text-base text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
            <IoIosArrowForward className="mt-2" />
          </div>
        ))}
      </div>
    </ScrollButtonsLayout>
  );
}
