/** Shared Form / Buttons props for EditPointDetails and EditGeometryDetails. */
export type EditObservationFormProps = {
  setAction: (value: string) => void;
  setOpenEdit: (value: boolean) => void;
};

export type EditObservationButtonsProps = EditObservationFormProps & {
  handleUpdate: () => void;
};
