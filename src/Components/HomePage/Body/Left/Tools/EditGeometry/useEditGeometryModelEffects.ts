import { useEffect } from "react";

type MapLike = { pointsGraphicsLayer?: { removeAll: () => void } | null };
type UserLike = { user_id?: number; role?: string };

export function useEditGeometryModelEffects(input: {
  map: MapLike;
  user: UserLike;
  fetchGeometries: (params: { regio?: string }) => void;
}) {
  const { map, user, fetchGeometries } = input;

  useEffect(() => {
    map.pointsGraphicsLayer?.removeAll();
  }, [map.pointsGraphicsLayer]);

  useEffect(() => {
    if (user.user_id === undefined || user.user_id === 0) return;
    fetchGeometries({
      regio: user.role && user.role !== "admin" ? user.role : undefined,
    });
  }, [user.user_id, user.role, fetchGeometries]);
}
