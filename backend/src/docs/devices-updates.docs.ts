/**
 * @openapi
 * /devices-updates/devices:
 *   get:
 *     tags:
 *       - DevicesUpdates
 *     summary: List Getac devices and update status
 *     description: Admin-only. Requires an authenticated session.
 *     responses:
 *       200:
 *         description: Device list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 devices:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 */

/**
 * @openapi
 * /devices-updates/devices/{id}/reset:
 *   post:
 *     tags:
 *       - DevicesUpdates
 *     summary: Reset a stuck device command
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Device command reset
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 */

/**
 * @openapi
 * /devices-updates/devices/{id}/check-status:
 *   post:
 *     tags:
 *       - DevicesUpdates
 *     summary: Queue a check-status command for the device agent
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Check-status command queued
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 */

/**
 * @openapi
 * /devices-updates/devices/{id}/update:
 *   post:
 *     tags:
 *       - DevicesUpdates
 *     summary: Queue a software update command for the device agent
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Update command queued
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Admin role required
 */

/**
 * @openapi
 * /devices-updates/agent:
 *   post:
 *     tags:
 *       - DevicesUpdates
 *     summary: Device agent endpoints (register, report, poll commands)
 *     description: Used by the on-device agent; authenticated via device token middleware, not admin session.
 *     responses:
 *       200:
 *         description: Agent request handled
 *       401:
 *         description: Invalid or missing device token
 */

export {};
