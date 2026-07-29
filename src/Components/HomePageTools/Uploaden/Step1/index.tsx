export default function Step1() {
  return (
    <div className="text-gray-700 p-2 px-4">
      <p className="pb-4">
        Kies bestanden om te uploaden vanaf uw computer om deze tijdelijk
        beschikbaar te maken op de kaart.
      </p>
      <p className="pb-4">
        <span className="font-bold text-black">
          Ondersteunde bestandsformaten:
        </span>
        .csv, /xlsx, .kml, .shp, .gpx, of een .zip met een file geodatabase of
        shapefiles
      </p>
      <div className="border-2 border-black p-4 mb-4">
        <p>
          <span></span>
          <span className="font-bold text-black">Opmerking: </span>
          Grote of complexe ruimtelijke gegevens kunnen de browserperformance
          beinvloeden.
        </p>
      </div>
      <div className="border-2 border-gray-300 p-1">
        <input type="file" id="upload-file" />
      </div>
    </div>
  );
}
