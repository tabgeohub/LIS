import assert from "assert";
import {
  classifyVerifyGrantFailure,
  classifyVerifyLookup,
} from "./verifyCredentialsFlow";

assert.deepEqual(classifyVerifyLookup({ ok: false, reason: "not_found" }), { kind: "invalid_username" });
assert.deepEqual(classifyVerifyLookup({ ok: true, userId: "1", hasOtp: true }), { kind: "otp_required" });
assert.deepEqual(classifyVerifyLookup({ ok: true, userId: "1", hasOtp: false }), { kind: "attempt_password_grant", otpStatusUnknown: false });
assert.deepEqual(classifyVerifyLookup({ ok: false, reason: "lookup_unavailable" }), { kind: "attempt_password_grant", otpStatusUnknown: true });

const ambiguous = { error: "invalid_grant", message: "Invalid user credentials" };
assert.equal(classifyVerifyGrantFailure(ambiguous, false).requiresOtp, false);
assert.equal(classifyVerifyGrantFailure(ambiguous, true).requiresOtp, true);
assert.equal(classifyVerifyGrantFailure({ message: "OTP required" }, false).requiresOtp, true);
console.log("verifyCredentialsFlow tests passed");
