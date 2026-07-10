# Auth2 manual test matrix

Run before treating auth2 as production-ready. Check each box when verified.

Prerequisites:

- Backend running with Keycloak configured
- LIS Desktop (or API client with `X-LIS-Client: desktop` and cookies)
- Set `AUTH2_REQUIRE_CLIENT_HEADER=true` when testing client-header cases (8–9)

## OTP flow

Step 1 for OTP users (`hasOtp === true`): username exists → `otp_required` — **password not validated**.

Step 2: username + password + OTP submitted to Keycloak.

**Keycloak limitation:** token grant often returns the same ambiguous `invalid_grant` / `Invalid user credentials` for wrong password and wrong OTP. The backend cannot always distinguish them and returns `password_or_otp_incorrect` instead of guessing.

| # | Test case | Expected result | Pass |
|---|-----------|-----------------|------|
| OTP-1 | OTP user + correct username + **wrong password** → Step 1 | Moves to OTP step | [ ] |
| OTP-1b | … + **correct OTP** → Step 2 | `password_or_otp_incorrect` if ambiguous; Desktop **stays Step 2**; user can use “Wachtwoord wijzigen” | [ ] |
| OTP-2 | OTP user + correct username + correct password → Step 1 | Moves to OTP step | [ ] |
| OTP-2b | … + **wrong OTP** → Step 2 | `password_or_otp_incorrect` if ambiguous; stay Step 2; clear OTP only | [ ] |
| OTP-3 | OTP user + correct password + **correct OTP** → Step 2 | Login success | [ ] |

## Manual tests A–E

| Test | Steps | Expected |
|------|-------|----------|
| A | OTP user, correct creds + correct OTP | Login success |
| B | OTP user, correct password + wrong OTP | `password_or_otp_incorrect`; stay Step 2 |
| C | OTP user, wrong password + correct OTP | `password_or_otp_incorrect`; stay Step 2 |
| D | Non-OTP user, wrong password | `password_incorrect` on Step 1 |
| E | Non-OTP user, correct password | Login success from Step 1 |

## Non-OTP and other

| # | Test case | Expected result | Pass |
|---|-----------|-----------------|------|
| 1 | Non-OTP user + correct password | Login success from Step 1 | [ ] |
| 2 | Non-OTP user + wrong password | Step 1 `password_incorrect` | [ ] |
| 7 | Unknown username | Username incorrect or safe generic message | [ ] |
| 8 | Missing `X-LIS-Client` (when required) | 403 `CLIENT_HEADER_REQUIRED` | [ ] |
| 9 | Wrong `X-LIS-Client` (when required) | 403 `CLIENT_HEADER_REQUIRED` | [ ] |
| 10 | Valid session + `GET /auth2/me` | Returns user/session | [ ] |
| 15 | Logout | Auth cleared | [ ] |
| 16 | Logout after local field data exists | Field data still exists | [ ] |

## Notes

- Explicit Keycloak OTP errors still map to `otp_incorrect`; explicit password errors to `password_incorrect`.
- Ambiguous `invalid_grant` on Step 2 maps to `password_or_otp_incorrect` — Desktop must not auto-return to Step 1.
- Enable `AUTH2_DEBUG_CLASSIFIER=true` to log classifier decisions (no credentials).
