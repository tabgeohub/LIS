# Auth2 (LIS Desktop / future iOS)

Desktop-oriented authentication under `/auth2/*`. Uses Keycloak password grant + Express session cookie (`lis.sid`).

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/auth2/verify-credentials` | Step 1: username/password; may return `otp_required` |
| POST | `/auth2/login` | Step 2 (or single-step): password ± OTP |
| GET | `/auth2/me` | Session status; refreshes tokens when needed |
| POST | `/auth2/logout` | Ends session; revokes refresh token |

## Client header

Set `AUTH2_REQUIRE_CLIENT_HEADER=true` to require `X-LIS-Client: desktop` or
`X-LIS-Client: ios` on all auth2 routes above. Requests with another value (or
without the header) receive `403 CLIENT_HEADER_REQUIRED`. With the setting
disabled, the existing web-compatible header-optional behavior is unchanged.

Desktop sends this header on verify, login, logout, and `/auth2/me`.

## Session duration (two layers)

Effective session length is controlled by **both**:

1. **Keycloak** — access token TTL, refresh token lifetime, SSO session max
2. **Backend** — Express session cookie `maxAge` and Redis TTL (when `SESSION_STORE=redis`)

Environment:

| Variable | Default | Meaning |
|----------|---------|---------|
| `SESSION_COOKIE_MAX_AGE_MS` | `28800000` (8 hours) | `lis.sid` cookie max age and Redis session TTL |
| `SESSION_ROLLING` | `true` (unless `"false"`) | Extends cookie on session-touching requests |

If the Express cookie expires before Keycloak refresh tokens, the client must log in again even if Keycloak would still accept a refresh.

`/auth2/me` calls `ensureFreshSession`, which can refresh Keycloak tokens while the backend session cookie is still valid.

## Identity contract

Successful `/auth2/login` and successful non-OTP `/auth2/verify-credentials`
responses add `identity`; `/auth2/me` includes the same field. For a linked
account it is:

```json
{
  "user_id": 42,
  "regio_id": "RWS EXAMPLE",
  "is_admin": false
}
```

`user_id` is selected from `lis.users.user_id` by the authenticated Keycloak
`preferred_username` (or verified email fallback), case-insensitively. It is
never guessed from a display name or OIDC `sub`. `regio_id` comes from the same
realm-role selection used by existing region filters; `admin` yields
`is_admin: true`. Desktop/web logins remain compatible when no legacy LIS user
row is present and receive `identity: null`. iOS login/verification rejects an
authenticated but unlinked account with `403 IDENTITY_NOT_LINKED` before a
session is persisted, so native callers never receive a successful login
without a numeric LIS user ID.

## OTP verify step

`POST /auth2/verify-credentials`:

| User type | Step 1 behavior |
|-----------|-----------------|
| `hasOtp === true` | Username exists → `otp_required` immediately. **Password not validated.** |
| `hasOtp === false` | Password grant → `authenticated` or `password_incorrect` |
| `hasOtp === null` | Password grant; explicit Keycloak OTP signal → `otp_required`, else `password_incorrect` |

`POST /auth2/login` (Step 2) validates username + password + OTP.

| Grant result | Response |
|--------------|----------|
| Success | Login |
| Explicit OTP error | `otp_incorrect` |
| Explicit password error | `password_incorrect` |
| Ambiguous `invalid_grant` | `password_or_otp_incorrect` (cannot distinguish wrong password vs wrong OTP) |

## Manual testing

See [AUTH2_TEST_MATRIX.md](./AUTH2_TEST_MATRIX.md).
