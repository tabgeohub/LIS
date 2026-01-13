export default function Step1({
  setStep,
  setFase,
}: {
  setStep: (value: number) => void;
  setFase: (value: string) => void;
}) {
  return (
    <div>
      <div className="text-sm text-gray-500 mt-2 px-2">
        Klik op 'Toevoegen' als u de in de kaart geselecteerde aandachtspunten
        wilt toevoegen aan een vluchtplan. Wanneer u de selectie wilt aanpassen,
        klik dan op 'Annuleren' om terug te gaan naar de resultatenlijst.
      </div>
      <div className="flex justify-end mt-4 gap-x-2 px-2">
        <button className="gray-button" onClick={() => setStep(2)}>
          Toevoegen
        </button>
        <button className="gray-button" onClick={() => setFase("all")}>
          Annuleren
        </button>
      </div>
    </div>
  );
}
