import SelectComp, {
  type SelectCompProps,
} from "../FormComponents/SelectComp";

export default function FilterSelect(props: SelectCompProps) {
  return (
    <SelectComp
      {...props}
      containerClassName=""
      selectClassName="cursor-pointer"
    />
  );
}
