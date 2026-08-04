import InputComp from "Components/Common/FormComponents/InputComp";

export function ReadOnlyPointFields({ values, labels }: { values: any; labels: any }) {
  return <>
    <InputComp type="date" value={values.createdAt} label={labels.datum} setValue={() => {}} disabled />
    <InputComp value={String(values.userId)} label={labels.aanmaker} setValue={() => {}} disabled />
    <InputComp value={values.regioId} label={labels.regio} setValue={() => {}} disabled />
  </>;
}

export function ReadOnlyPointCoordinates({ values, labels }: { values: any; labels: any }) {
  return <>
    <InputComp value={`(${values.x.toFixed(4)}, ${values.y.toFixed(4)})`} label={labels.rd} setValue={() => {}} disabled />
    <InputComp value={`(${values.latitude.toFixed(4)}, ${values.longitude.toFixed(4)})`} label={labels.wgs84} setValue={() => {}} disabled />
    <InputComp value={values.confidential ? "Ja" : "Nee"} label={labels.vertrouwelijk} setValue={() => {}} disabled />
  </>;
}
