import { createConstLookupHandler } from "./createConstLookupHandler";

export const getLuchtvaartuig = createConstLookupHandler({
  select: "id, naam",
  from: "lis.luchtvaartuig",
  errorLabel: "piloten",
});
