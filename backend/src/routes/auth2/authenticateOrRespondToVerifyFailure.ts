import type { Request, Response } from "express";
import type { KeycloakUserLookupResult } from "./keycloakUserLookup";
import { authenticatePasswordCredentials } from "./verifyCredentialsFlow";
import { respondToVerifyGrantFailure } from "./respondToVerifyGrantFailure";
import { isAuth2IdentityUnavailableError } from "./authIdentity";

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
      identity: input.req.session.auth?.identity ?? null,
    });
  } catch (error: unknown) {
    if (isAuth2IdentityUnavailableError(error)) {
      return input.res.status(502).json({
        success: false,
        code: "IDENTITY_UNAVAILABLE",
        message: "Authenticated Keycloak response is missing a valid subject",
      });
    }
    return respondToVerifyGrantFailure({ ...input, error });
  }
}
