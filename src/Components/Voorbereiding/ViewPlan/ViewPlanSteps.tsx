import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import EditPoint from "./Steps/EditPoint";
import AddPointStep from "./Steps/AddPointStep";
import DuplicateFlightPlan from "./Steps/DuplicateFlightPlan";
import AddPointsFromPlan from "./Steps/AddPointsFromPlan";
import AddPointToPlan from "./Steps/AddPointToPlan";

const STEP_COMPONENTS: Record<
  number,
  (props: {
    vluchtnummer: string;
    setVluchtnummer: (value: string) => void;
    handleCancel: () => void;
    refetch: () => void;
  }) => JSX.Element | null
> = {
  1: ({ setVluchtnummer, handleCancel }) => (
    <Step1 setVluchtnummer={setVluchtnummer} handleCancel={handleCancel} />
  ),
  2: ({ vluchtnummer, setVluchtnummer, handleCancel, refetch }) => (
    <Step2
      vluchtnummer={vluchtnummer}
      setVluchtnummer={setVluchtnummer}
      handleCancel={handleCancel}
      refetch={refetch}
    />
  ),
  3: () => <EditPoint />,
  4: () => <AddPointStep />,
  5: ({ handleCancel, refetch }) => (
    <DuplicateFlightPlan refetch={refetch} handleCancel={handleCancel} />
  ),
  6: () => <AddPointsFromPlan />,
  7: () => <AddPointToPlan />,
};

export default function ViewPlanSteps({
  step,
  vluchtnummer,
  setVluchtnummer,
  handleCancel,
  refetch,
}: {
  step: number;
  vluchtnummer: string;
  setVluchtnummer: (value: string) => void;
  handleCancel: () => void;
  refetch: () => void;
}) {
  const render = STEP_COMPONENTS[step];
  if (!render) return null;

  return render({ vluchtnummer, setVluchtnummer, handleCancel, refetch });
}
