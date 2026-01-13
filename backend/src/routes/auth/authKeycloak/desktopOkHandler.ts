import { type RequestHandler } from "express";

// GET /auth/desktop-ok
export const desktopOkHandler: RequestHandler = (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(`<html><body>
    <h3>Login gelukt. Je kunt dit venster sluiten.</h3>
    <script>window.close();</script>
  </body></html>`);
};
