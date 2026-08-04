import SelectComp, {
  type SelectCompProps,
} from "Components/Common/FormComponents/SelectComp";

export default function FilterSelect(props: SelectCompProps) {
  return (
    <SelectComp
      {...props}
      containerClassName=""
      selectClassName="cursor-pointer"
    />
  );
}
