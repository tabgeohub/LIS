import { type RequestHandler } from "express";
import {
  buildAuthenticatedMeBody,
  unauthenticatedMeBody,
} from "./buildMeResponse";

export const meHandler: RequestHandler = (req, res) => {
  const auth = req.session.auth;

  if (!auth?.tokenSet?.access_token) {
    return res.status(401).json(unauthenticatedMeBody());
  }

  return res.json(buildAuthenticatedMeBody(req.session, auth));
};
