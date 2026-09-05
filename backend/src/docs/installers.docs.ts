/**
 * @openapi
 * /installers/latest:
 *   get:
 *     tags:
 *       - Installers
 *     summary: Get metadata for the latest uploaded installer
 *     responses:
 *       200:
 *         description: Latest installer metadata (or empty)
 *       401:
 *         description: Not authenticated
 */

/**
 * @openapi
 * /installers/download:
 *   get:
 *     tags:
 *       - Installers
 *     summary: Download the latest installer binary
 *     responses:
 *       200:
 *         description: Installer file stream
 *       404:
 *         description: No installer available
 */

/**
 * @openapi
 * /installers:
 *   post:
 *     tags:
 *       - Installers
 *     summary: Upload a new installer (admin)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               version:
 *                 type: string
 *     responses:
 *       201:
 *         description: Installer uploaded
 *       400:
 *         description: Invalid file
 *       403:
 *         description: Admin required
 */

/**
 * @openapi
 * /installers/latest:
 *   delete:
 *     tags:
 *       - Installers
 *     summary: Delete the current installer (admin)
 *     responses:
 *       200:
 *         description: Installer deleted
 *       403:
 *         description: Admin required
 */

export {};
