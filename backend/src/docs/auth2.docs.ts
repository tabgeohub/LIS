/**
 * @openapi
 * /auth2/verify-credentials:
 *   post:
 *     tags:
 *       - Auth2
 *     summary: Verify credentials (step 1) without creating a session
 *     description: Part of the Keycloak-backed auth2 flow. Requires the auth client header. Rate-limited.
 *     security: []
 *     parameters:
 *       - in: header
 *         name: x-auth-client
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Credentials accepted; continue to login/OTP step
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Rate limited
 */

/**
 * @openapi
 * /auth2/login:
 *   post:
 *     tags:
 *       - Auth2
 *     summary: Complete login and establish session
 *     description: Completes the auth2 login (password and/or OTP step). Requires the auth client header. Rate-limited.
 *     security: []
 *     parameters:
 *       - in: header
 *         name: x-auth-client
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               otp:
 *                 type: string
 *                 description: One-time password when required by Keycloak
 *     responses:
 *       200:
 *         description: Login successful; session cookie set
 *       401:
 *         description: Authentication failed
 *       429:
 *         description: Rate limited
 */

/**
 * @openapi
 * /auth2/me:
 *   get:
 *     tags:
 *       - Auth2
 *     summary: Current authenticated user
 *     parameters:
 *       - in: header
 *         name: x-auth-client
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Current user profile and roles
 *       401:
 *         description: Not authenticated
 */

/**
 * @openapi
 * /auth2/logout:
 *   post:
 *     tags:
 *       - Auth2
 *     summary: End the current session
 *     parameters:
 *       - in: header
 *         name: x-auth-client
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Logged out
 *       401:
 *         description: Not authenticated
 */

export {};
