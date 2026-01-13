/**
 * @openapi
 * /emails/{role}:
 *   get:
 *     tags:
 *       - Emails
 *     summary: Get all emails by role
 *     parameters:
 *       - name: role
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           example: admin
 *     responses:
 *       200:
 *         description: List of emails for the specified role
 */

/**
 * @openapi
 * /emails/{id}:
 *   patch:
 *     tags:
 *       - Emails
 *     summary: Edit a single email
 *     parameters:
 *       - name: id
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
 *             properties:
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email updated successfully
 */

/**
 * @openapi
 * /emails/{id}:
 *   delete:
 *     tags:
 *       - Emails
 *     summary: Delete an email by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email deleted successfully
 */

/**
 * @openapi
 * /emails:
 *   post:
 *     tags:
 *       - Emails
 *     summary: Create a new email template
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *             required:
 *               - role
 *               - subject
 *               - message
 *     responses:
 *       201:
 *         description: Email template created successfully
 */

/**
 * @openapi
 * /emails/sendEmail:
 *   post:
 *     tags:
 *       - Emails
 *     summary: Send spoed (urgent) email with attachments
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               senderName:
 *                 type: string
 *               senderEmail:
 *                 type: string
 *               recipientName:
 *                 type: string
 *               flightNumber:
 *                 type: string
 *               omschrijving:
 *                 type: string
 *               regio_id:
 *                 type: string
 *               sendToEmail:
 *                 type: string
 *               waarnemer:
 *                 type: string
 *               vertrouwelijk:
 *                 type: string
 *                 enum: ["0", "1"]
 *               longitude:
 *                 type: number
 *               latitude:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               screenshots:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Email sent successfully
 *       400:
 *         description: No images uploaded
 *       500:
 *         description: Failed to send email
 */
