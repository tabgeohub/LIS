export function AllPlansCheckbox(props: {
  showAllPlans: boolean;
  setShowAllPlans: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-x-1 absolute top-20 left-0 z-10 px-1 py-1 bg-white border-b border-t border-gray-300 w-full">
      <input
        type="checkbox"
        className="cursor-pointer"
        id="allPlans"
        checked={props.showAllPlans}
        onChange={() => props.setShowAllPlans(!props.showAllPlans)}
      />
      <label
        htmlFor="allPlans"
        className="text-[12px] cursor-pointer text-primary font-semibold"
      >
        Alle vluchtplannen
      </label>
    </div>
  );
}
