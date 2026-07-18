import type { AttachmentType } from "Types/finished_plans";
import { deleteArcgisPointAttachment } from "@helpers/arcgis/deleteArcgisAttachment";
import toast from "react-hot-toast";

export async function deleteFotoFromArcgis(
  removed: AttachmentType,
  setLoading: (value: boolean) => void
): Promise<boolean> {
  if (!removed.url) return false;
  try {
    await deleteArcgisPointAttachment(
      removed.url,
      removed.attachmentid ?? null
    );
    return true;
  } catch (e) {
    toast.error(
      e instanceof Error ? e.message : "Verwijderen op kaartlaag mislukt"
    );
    setLoading(false);
    return false;
  }
}
