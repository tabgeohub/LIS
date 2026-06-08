/**
 * @openapi
 * /auth:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Legacy email/password login
 *     description: Production auth uses Keycloak via `/auth` routes on the backend root. This endpoint is the legacy session login under `/api/auth`.
 *     security: []
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
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

export {};
