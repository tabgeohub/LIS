import Block1 from "./Block1";
import Overig from "./Overig";
import NNederland from "./NNederland";

export default function LayersList({
  usedPlace = "Kaartlagen",
}: {
  usedPlace?: string;
}) {
  return (
    <div>
      {usedPlace === "Kaartlagen" && <Block1 />}

      <Overig />

      <NNederland />
    </div>
  );
}
