import { useContent } from "hooks/useContent";

export function CreateImageBtnView(props: {
  fileInputId: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const content = useContent();
  return (
    <>
      <label className="gray-button flex items-center" htmlFor={props.fileInputId}>
        <span>
          {
            content.nabewerking.vluchtenZoeken.step2.waarnemingen
              .editPointDetails.addNewImage
          }
        </span>
      </label>
      <input
        id={props.fileInputId}
        type="file"
        accept="image/*"
        onChange={props.onFileChange}
        className="mt-2 p-2 border border-gray-300 rounded sr-only"
      />
    </>
  );
}
