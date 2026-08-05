/**
 * @openapi
 * /logs:
 *   post:
 *     tags:
 *       - Logs
 *     summary: Create flight logging entries
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [logs]
 *             properties:
 *               logs:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Logs created
 *       500:
 *         description: Failed to create logs
 */

/**
 * @openapi
 * /logs/podLogs:
 *   post:
 *     tags:
 *       - Logs
 *     summary: Create pod-level logging entries
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Pod logs accepted
 *       500:
 *         description: Failed to create pod logs
 */

export {};
