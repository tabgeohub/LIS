import { Express } from "express";
import cors from "cors";
import { isAllowedCorsOrigin } from "../helpers/cors/allowedOrigins";
import { LIS_CLIENT_HEADER } from "../routes/auth2/authClientHeader";

export function configureCorsMiddleware(app: Express) {
  app.use(
    cors({
      origin: (origin, callback) =>
        callback(null, isAllowedCorsOrigin(origin)),
      credentials: true,
      allowedHeaders: [
        "Content-Type",
        "Accept",
        "Authorization",
        LIS_CLIENT_HEADER,
        "X-LIS-Client",
      ],
    })
  );
}
