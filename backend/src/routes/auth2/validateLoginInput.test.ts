import assert from "assert";
import { parseLoginInput, parseVerifyInput } from "./validateLoginInput";

assert.deepEqual(
  parseLoginInput({ username: " user ", password: "secret", otp: " 123456 " }),
  { username: "user", password: "secret", otp: "123456" }
);
assert.equal(parseLoginInput({ username: "", password: "secret" }), null);
assert.equal(
  parseLoginInput({ username: "user", password: "secret", otp: "12ab" }),
  null
);
assert.equal(
  parseLoginInput({ username: "user", password: "secret", otp: "123456789" }),
  null
);
assert.deepEqual(parseVerifyInput({ username: "user", password: "secret" }), {
  username: "user",
  password: "secret",
});

console.log("validateLoginInput tests passed");
