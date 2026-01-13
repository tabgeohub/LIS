/**
 * @openapi
 * /templateFlight:
 *   get:
 *     tags:
 *       - TemplatePlans
 *     summary: Get all template flight plans
 *     responses:
 *       200:
 *         description: List of template flight plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 */

/**
 * @openapi
 * /templateFlight:
 *   post:
 *     tags:
 *       - TemplatePlans
 *     summary: Create a new template flight plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               points:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     latitude:
 *                       type: number
 *                     longitude:
 *                       type: number
 *             required:
 *               - name
 *               - points
 *     responses:
 *       201:
 *         description: Template flight plan created successfully
 */
