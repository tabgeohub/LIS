import { Request, Response } from "express";

export async function podLogs(req: Request, res: Response): Promise<void> {
  try {
    const { logs } = req.body;

    if (!Array.isArray(logs)) {
      res.status(400).json({ message: "Body must be { logs: [] }" });
      return;
    }

    res.status(200).json({ ok: true, received: logs.length });
  } catch (err) {
    res.status(500).json({
      result: null,
      message: `Failed to create logs: ${
        err instanceof Error ? err.message : String(err)
      }`,
    });
  }
}
