import { useState } from "react";
import { useFlightPlanState } from "../../../helpers/flightPlanStates";
import { useReadData } from "utils/useReadData";
import { useCreateData } from "utils/useCreateData";
import { kaartlagenState } from "hooks/kaartlagen/kaartlagenState";
import { useAuth } from "@helpers/ZustandStates/useAuth";
import { useMapViewState } from "@helpers/ZustandStates/mapViewState";

import Fase1 from "./Fase1";
import Fase2 from "./Fase2";
import Fase3 from "./Fase3";
import toast from "react-hot-toast";

export interface FlightPlanTemplate {
  id: number;
  name: string;
  points: {
    id: number;
    omschrijving: string;
    xcoordinaat_rd: number;
    ycoordinaat_rd: number;
    latitude: number;
    longitude: number;
  }[];
}

export default function TemplateFlight({
  basemapString,
}: {
  basemapString: string;
}) {
  const [fase, setFase] = useState(1);

  const [selectedTemplate, setSelectedTemplate] =
    useState<FlightPlanTemplate | null>(null);

  const { user } = useAuth();

  const { data: flightTemplate } = useReadData<FlightPlanTemplate[]>(
    `/templateFlight?regio_id=${user.role}`
  );

  const { create } = useCreateData("/flightPlans");

  const { clearGraphics } = useMapViewState();

  const { selectedLayers } = kaartlagenState();

  const {
    setStep,
    vluchtnummer,
    omschrijving,
    waarnemer,
    piloot,
    datum,
    geplandeVliegduur,
    typeLuchtvaartuig,
    aantalPassagiers,
    doelEnHoofdthema,
    aanvullendeInfo,
    clear,
  } = useFlightPlanState();

  const handleSubmit = (points) => {
    const attributes = {
      vluchtnummer,
      omschrijving,
      waarnemer,
      piloot,
      datum,
      vliegduur: geplandeVliegduur,
      luchtvaartuig: typeLuchtvaartuig,
      passagiers: aantalPassagiers,
      hoofdthema: doelEnHoofdthema,
      aanvullende: aanvullendeInfo,
      points: points,
      basemap: basemapString,
      layers: selectedLayers.join(","),
      user_id: user?.user_id,
      status: "pre-prepared",
      regio_id: user.role,
    };

    create(attributes, () => {
      setTimeout(() => {
        toast(
          "Ga naar “Vluchtplan-informatie” om je vlucht te controleren of bij te werken.",
          {
            duration: 5000,
          }
        );
      }, 1000);

      clear();
      clearGraphics();
    });
  };

  return (
    <div className="h-full">
      {fase === 1 && <Fase1 setFase={setFase} setStep={setStep} />}

      {fase === 2 && flightTemplate && (
        <Fase2
          setFase={setFase}
          flightTemplate={flightTemplate}
          setSelectedTemplate={setSelectedTemplate}
        />
      )}

      {fase === 3 && (
        <Fase3
          setFase={setFase}
          selectedTemplate={selectedTemplate}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
