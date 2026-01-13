import { useContent } from "hooks/useContent";
import Buttons from "./Buttons";

export default function Step1({
  name,
  setName,
}: {
  name: string;
  setName: (value: string) => void;
}) {
  const content = useContent();

  return (
    <div className="p-3">
      <div className="space-y-2">
        <p className="col-span-2 labelClass">
          {content.voorbereiding.vluchtenTemplate.step1.text}
          {<span className="text-gray-500"> *</span>}
        </p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="inputClass !w-[75%] col-span-4"
          placeholder={content.voorbereiding.vluchtenTemplate.step1.placeholder}
        />
      </div>

      <Buttons name={name} />
    </div>
  );
}
