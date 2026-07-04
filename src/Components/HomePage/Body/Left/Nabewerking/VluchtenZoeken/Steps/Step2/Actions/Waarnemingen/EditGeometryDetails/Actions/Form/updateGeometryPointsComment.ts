import axios from "axios";
import { getBackEndUrl } from "@helpers/getBackEndUrl";
import type { FinishedGeometryType } from "Types/finished_plans";

type GeometryPoint = NonNullable<FinishedGeometryType["points"]>[number];

function buildPointUpdatePayload(point: GeometryPoint, comment: string) {
  return {
    omschrijving: point.omschrijving,
    regio_id: point.regio_id,
    xcoordinaat_rd: point.xcoordinaat_rd,
    ycoordinaat_rd: point.ycoordinaat_rd,
    latitude: point.latitude,
    longitude: point.longitude,
    vertrouwelijk: point.vertrouwelijk,
    herhalen: point.herhalen,
    user_id: point.user_id,
    activiteit_id: point.activiteit_id,
    organisatie_id: point.organisatie_id,
    specifiek_letten_op: comment,
    datum: point.datum,
    id: point.id,
  };
}

async function patchGeometryPoint(point: GeometryPoint, comment: string) {
  try {
    const response = await axios.patch(
      `${getBackEndUrl()}/api/points/${point.id}`,
      buildPointUpdatePayload(point, comment),
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.result) {
      return { ...point, specifiek_letten_op: comment, point_comment: comment };
    }
    return null;
  } catch (err) {
    console.error(`Failed to update point ${point.id}:`, err);
    return null;
  }
}

export async function updateGeometryPointsComment(input: {
  points: GeometryPoint[];
  comment: string;
}) {
  const updatedPoints = await Promise.all(
    input.points.map((point) => patchGeometryPoint(point, input.comment))
  );
  return updatedPoints.filter((point) => point !== null) as GeometryPoint[];
}
