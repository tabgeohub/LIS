import assert from "assert";
import { mapLoginError } from "./mapLoginError";
import { resolveLoginErrorDecision } from "./loginErrorDecision";

assert.deepEqual(mapLoginError({ message: "OTP required" }), {
  status: 401,
  body: {
    success: false,
    status: "otp_required",
    message: "Authenticator-code is required",
    code: "OTP_REQUIRED",
  },
});

assert.equal(
  mapLoginError({ message: "Invalid OTP" }, { otpWasSent: true }).body.status,
  "otp_incorrect"
);
assert.equal(
  mapLoginError(
    { error: "invalid_grant", message: "Invalid user credentials" },
    { otpWasSent: true }
  ).body.status,
  "password_or_otp_incorrect"
);
assert.equal(
  mapLoginError(
    { error: "invalid_grant", message: "Invalid user credentials" },
    { otpWasSent: false }
  ).body.status,
  "password_incorrect"
);
assert.equal(
  mapLoginError({ message: "Unexpected grant error" }).body.status,
  "password_incorrect"
);

const internal = resolveLoginErrorDecision({
  kind: "server_error" as never,
  otpWasSent: false,
  errorMessage: "internal detail",
  exposeErrorMessage: false,
});
assert.deepEqual(internal.result, {
  status: 500,
  body: { success: false, message: "Login failed", error: undefined },
});

console.log("mapLoginError tests passed");
