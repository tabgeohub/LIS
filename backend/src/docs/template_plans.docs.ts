/**
 * @openapi
 * /templateFlight:
 *   get:
 *     tags:
 *       - TemplatePlans
 *     summary: Get all template flight plans
 *     parameters:
 *       - $ref: '#/components/parameters/RegioId'
 *     responses:
 *       200:
 *         description: List of template flight plans with geometries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   regio_id:
 *                     type: string
 *                   points:
 *                     type: array
 *                     items:
 *                       type: integer
 *                   geometries:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/GeometryGroup'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   post:
 *     tags:
 *       - TemplatePlans
 *     summary: Create a template flight plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               points:
 *                 type: array
 *                 items:
 *                   type: integer
 *               regio_id:
 *                 type: string
 *             required:
 *               - name
 *               - points
 *               - regio_id
 *     responses:
 *       201:
 *         description: Template created
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /templateFlight/templateName:
 *   post:
 *     tags:
 *       - TemplatePlans
 *     summary: Check or reserve a template name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Name availability result
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

export {};
