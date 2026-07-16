import assert from "assert";
import { extractGrantError } from "./grantError";

assert.deepEqual(
  extractGrantError({
    error: "invalid_grant",
    error_description: "Invalid credentials",
    message: "request failed",
  }),
  {
    error: "invalid_grant",
    error_description: "Invalid credentials",
    message: "Invalid credentials",
  }
);

const embedded = extractGrantError({
  message: '{"error":"invalid_grant","error_description":"OTP required"}',
});
assert.equal(embedded.error, "invalid_grant");
assert.equal(
  embedded.error_description,
  '{"error":"invalid_grant","error_description":"OTP required"}'
);

assert.deepEqual(extractGrantError({ message: "not-json {broken" }), {
  error: undefined,
  error_description: "not-json {broken",
  message: "not-json {broken",
});
assert.deepEqual(extractGrantError(null), {
  error: undefined,
  error_description: undefined,
  message: "Unknown grant error",
});

console.log("grantError tests passed");
