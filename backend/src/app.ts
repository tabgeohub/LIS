import "dotenv/config";
import express from "express";
import { configureExpressApp } from "./configureExpressApp";

const app = express();

export const appReady = configureExpressApp(app);

export default app;
