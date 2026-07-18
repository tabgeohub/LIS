import { createConstLookupHandler } from "./createConstLookupHandler";

export const getOrganisaties = createConstLookupHandler({
  select: "id, naam",
  from: "lis.organisaties",
  orderBy: "naam ASC",
  errorLabel: "organisaties",
});
