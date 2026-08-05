/**
 * @openapi
 * /report-upload:
 *   post:
 *     tags:
 *       - ReportUpload
 *     summary: Upload a finished-plan report package
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
 *     responses:
 *       200:
 *         description: Report uploaded
 *       400:
 *         description: Invalid upload
 *       500:
 *         description: Upload failed
 */

export {};
