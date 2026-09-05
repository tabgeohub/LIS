/**
 * @openapi
 * /file-download/{filename}/password:
 *   post:
 *     tags:
 *       - FileDownload
 *     summary: Set a one-time password gate for a downloadable file
 *     parameters:
 *       - name: filename
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password set
 *       410:
 *         description: Download link expired
 */

/**
 * @openapi
 * /file-download/{filename}:
 *   get:
 *     tags:
 *       - FileDownload
 *     summary: Render or stream a password-gated file download
 *     parameters:
 *       - name: filename
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Download page or file stream
 *       410:
 *         description: Link expired
 */

export {};
