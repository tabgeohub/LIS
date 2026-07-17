import { RequestHandler } from "express";
import { buildAndSendSpoedReport } from "./buildAndSendSpoedReport";

export const sendEmail: RequestHandler = async (req, res) => {
  await buildAndSendSpoedReport({ req, res });
};
