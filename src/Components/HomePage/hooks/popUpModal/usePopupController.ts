import { usePopupMapClickEffect, usePopupOpenEffect, usePopupTabSyncEffects } from "./usePopupEffects";

export default function usePopupController(
  setOpenModal: (open: boolean) => void
) {
  usePopupMapClickEffect();
  usePopupOpenEffect(setOpenModal);
  usePopupTabSyncEffects(setOpenModal);
}
