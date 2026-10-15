import type { Request, Response } from "express";
import type { KeycloakUserLookupResult } from "./keycloakUserLookup";
import { authenticatePasswordCredentials } from "./verifyCredentialsFlow";
import { respondToVerifyGrantFailure } from "./respondToVerifyGrantFailure";

export async function authenticateOrRespondToVerifyFailure(input: {
  req: Request;
  res: Response;
  username: string;
  password: string;
  lookup: KeycloakUserLookupResult;
  otpStatusUnknown: boolean;
}) {
  try {
    const user = await authenticatePasswordCredentials(input);
    return input.res.json({
      success: true,
      status: "authenticated",
      message: "Login successful",
      user,
    });
  } catch (error: unknown) {
    return respondToVerifyGrantFailure({ ...input, error });
  }
}
