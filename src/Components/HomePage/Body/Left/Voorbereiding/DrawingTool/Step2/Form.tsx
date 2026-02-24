import SelectComp from "Components/HomePage/Body/Left/Common/FormComponents/SelectComp";
import CheckBoxComp from "Components/HomePage/Body/Left/Common/FormComponents/CheckBoxComp";
import TextAreaComp from "Components/HomePage/Body/Left/Common/FormComponents/TextAreaComp";
import InputComp from "Components/HomePage/Body/Left/Common/FormComponents/InputComp";
import { useContent } from "hooks/useContent";
import { useDrawingStore } from "hooks/zustand/useDrawingStore";
import useGetActiviteiten from "hooks/consts/useGetActiviteis";
import useGetOrganisaties from "hooks/consts/useGetOrganisaties";
import { useGeometriesStore } from "hooks/features/useGeometriesStore";
import { useMemo } from "react";

export default function Form() {
    const content = useContent();
    const activities = useGetActiviteiten();
    const organizations = useGetOrganisaties();
    const { dbGeometries } = useGeometriesStore();

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

    // Check if omschrijving already exists (case-insensitive)
    const omschrijvingExists = useMemo(() => {
        if (!omschrijving || omschrijving.trim() === "") return false;
        return dbGeometries.some(
            (geometry) =>
                geometry.omschrijving?.toLowerCase().trim() ===
                omschrijving.toLowerCase().trim()
        );
    }, [omschrijving, dbGeometries]);

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

            <div>
                <InputComp
                    label={content.voorbereiding.aandachtspuntAanmaken.step2.omschrijving}
                    value={omschrijving}
                    setValue={setOmschrijving}
                    required={true}
                />

                {omschrijvingExists && omschrijving !== "" && (
                    <div className="flex flex-col items-end mt-1">
                        <p className="text-red-500 text-xs">
                            Deze omschrijving bestaat al
                        </p>
                    </div>
                )}
            </div>

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
