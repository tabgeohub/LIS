import "dotenv/config";
import express from "express";
import { configureExpressApp } from "./configureExpressApp";

const app = express();
configureExpressApp(app);

export default app;
