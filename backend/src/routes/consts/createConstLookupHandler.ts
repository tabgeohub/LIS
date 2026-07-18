import { Request, Response } from "express";
import {
  fetchConstLookup,
  type FetchConstLookupInput,
} from "../../helpers/queries/consts/fetchConstLookup";

type ConstLookupHandlerOptions = Omit<FetchConstLookupInput, "res">;

export function createConstLookupHandler(options: ConstLookupHandlerOptions) {
  return async (_req: Request, res: Response): Promise<void> => {
    await fetchConstLookup({ res, ...options });
  };
}
