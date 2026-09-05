/**
 * @openapi
 * /emails:
 *   get:
 *     tags:
 *       - Emails
 *     summary: List all email addresses in the emailijst
 *     responses:
 *       200:
 *         description: Array of email rows
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   email:
 *                     type: string
 *                   regio_id:
 *                     type: string
 *                     nullable: true
 *       500:
 *         description: Failed to load emails
 */

/**
 * @openapi
 * /emails:
 *   post:
 *     tags:
 *       - Emails
 *     summary: Add an email address to the emailijst
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               regio:
 *                 type: string
 *                 description: Region/role id stored as regio_id
 *     responses:
 *       201:
 *         description: Email created
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Failed to create email
 */

/**
 * @openapi
 * /emails/{id}:
 *   patch:
 *     tags:
 *       - Emails
 *     summary: Update an email address
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
 *               id:
 *                 type: integer
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email updated
 *       404:
 *         description: Email not found
 */

/**
 * @openapi
 * /emails/{id}:
 *   delete:
 *     tags:
 *       - Emails
 *     summary: Delete an email address by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email deleted
 *       404:
 *         description: Email not found
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

export {};
