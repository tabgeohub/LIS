import { Request, Response } from "express";
import { authenticateUser, sendLoginError } from "./loginUserHelpers";

export async function loginUser(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  if (!username || !password) {
    res
      .status(400)
      .json({ message: "Gebruikersnaam en wachtwoord zijn verplicht" });
    return;
  }

  try {
    const user = await authenticateUser(username, password);
    if (!user) {
      res
        .status(401)
        .json({ message: "Ongeldige gebruikersnaam of wachtwoord" });
      return;
    }

    res.status(200).json({
      message: "Inloggen geslaagd",
      user,
    });
  } catch (err) {
    sendLoginError(res, err);
  }
}
