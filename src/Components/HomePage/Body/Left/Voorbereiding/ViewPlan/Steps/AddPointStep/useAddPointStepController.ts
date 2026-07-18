import { buildAddPointStepHandlers } from "./buildAddPointStepHandlers";
import { useAddPointStepStores } from "./useAddPointStepStores";

export function useAddPointStepController() {
  const stores = useAddPointStepStores();
  const handlers = buildAddPointStepHandlers(stores);
  return {
    addPointStep: stores.addPointStep,
    setAddPointStep: stores.setAddPointStep,
    ...handlers,
  };
}
