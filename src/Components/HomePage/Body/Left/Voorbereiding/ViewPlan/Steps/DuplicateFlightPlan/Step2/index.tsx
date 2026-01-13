/* eslint-disable react-hooks/exhaustive-deps */
import Buttons from "./Buttons";
import Form from "./Form";
import ScrollButtonsLayout from "Components/HomePage/Body/Left/Common/ScrollButtonsLayout";

export default function Step2({
  handleCancel,
  refetch,
}: {
  handleCancel: () => void;
  refetch: () => void;
}) {
  return (
    <ScrollButtonsLayout
      className="h-full"
      buttons={<Buttons refetch={refetch} handleCancel={handleCancel} />}
    >
      <div className="h-[60vh] py-4 px-2 space-y-4 overflow-y-scroll">
        <Form />
      </div>
    </ScrollButtonsLayout>
  );
}
