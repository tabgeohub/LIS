import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";
import CheckBoxComp from "Components/HomePage/Body/Left/Common/FormComponents/CheckBoxComp";
import TextAreaComp from "Components/HomePage/Body/Left/Common/FormComponents/TextAreaComp";
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { useContent } from "hooks/useContent";
import { useDrawingStore } from "hooks/zustand/useDrawingStore";
import useGetActiviteiten from "hooks/consts/useGetActiviteis";
import useGetOrganisaties from "hooks/consts/useGetOrganisaties";

export default function Form() {
    const content = useContent();
    const activities = useGetActiviteiten();
    const organizations = useGetOrganisaties();

    const {
        omschrijving,
        setOmschrijving,
        vertrouwelijk,
        setVertrouwelijk,
        herhalen,
        setHerhalen,
        activiteit,
        setActiviteit,
        organisatie,
        setOrganisatie,
        specifiekLettenOp,
        setSpecifiekLettenOp,
    } = useDrawingStore();

    return (
        <div className="space-y-5 text-[16px]">
            <CheckBoxComp
                checked={vertrouwelijk}
                value={vertrouwelijk}
                setValue={setVertrouwelijk}
                label={content.voorbereiding.aandachtspuntAanmaken.step2.vertrouwelijk}
            />

            <CheckBoxComp
                checked={herhalen}
                value={herhalen}
                setValue={setHerhalen}
                label={content.voorbereiding.aandachtspuntAanmaken.step2.herhalen}
            />

            <InputComp
                label={content.voorbereiding.aandachtspuntAanmaken.step2.omschrijving}
                value={omschrijving}
                setValue={setOmschrijving}
                required={true}
            />

            <SelectComp
                label={content.voorbereiding.aandachtspuntAanmaken.step2.activiteit}
                value={activiteit}
                setValue={setActiviteit}
                options={activities}
            />

            <SelectComp
                label={content.voorbereiding.aandachtspuntAanmaken.step2.organisatie}
                value={organisatie}
                setValue={setOrganisatie}
                options={organizations}
                required
            />

            <div className="grid grid-cols-6 gap-x-2 items-start">
                <TextAreaComp
                    value={specifiekLettenOp}
                    setValue={setSpecifiekLettenOp}
                    label={
                        content.voorbereiding.aandachtspuntAanmaken.step2.specifiekLettenOp
                    }
                />
            </div>
        </div>
    );
}
