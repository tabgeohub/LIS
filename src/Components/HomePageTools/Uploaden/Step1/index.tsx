const SUPPORTED_FORMATS =
  ".csv, .xlsx, .kml, .shp, .gpx, of een .zip met een file geodatabase of shapefiles";

export default function Step1() {
  return (
    <div className="text-gray-700 space-y-4">
      <p>
        Kies bestanden om te uploaden vanaf uw computer om deze tijdelijk
        beschikbaar te maken op de kaart.
      </p>
      <p>
        <span className="font-bold text-black">Ondersteunde bestandsformaten: </span>
        {SUPPORTED_FORMATS}
      </p>
      <div className="border-2 border-black p-4">
        <p>
          <span className="font-bold text-black">Opmerking: </span>
          Grote of complexe ruimtelijke gegevens kunnen de browserperformance
          beïnvloeden.
        </p>
      </div>
      <div className="border-2 border-gray-300 p-1">
        <input
          type="file"
          id="upload-file"
          accept=".csv,.xlsx,.kml,.shp,.gpx,.zip"
          aria-label="Bestand uploaden"
        />
      </div>
    </div>
  );
}
