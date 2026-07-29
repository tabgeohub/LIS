import Step2 from "./Step2";

export default function DuplicateFlightPlan({
  handleCancel,
  refetch,
}: {
  handleCancel: () => void;
  refetch: () => void;
}) {
  return (
    <div>
      <Step2 refetch={refetch} handleCancel={handleCancel} />
    </div>
  );
}
