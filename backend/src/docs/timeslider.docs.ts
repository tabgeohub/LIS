/**
 * @openapi
 * /timeslider/getTimeRange:
 *   get:
 *     tags:
 *       - Timeslider
 *     summary: Get min/max finished-plan dates for the timeslider
 *     parameters:
 *       - $ref: '#/components/parameters/RegioId'
 *     responses:
 *       200:
 *         description: Date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: string
 *                   format: date
 *                   nullable: true
 *                 to:
 *                   type: string
 *                   format: date
 *                   nullable: true
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /timeslider/getFinishedPlansTimeslider:
 *   get:
 *     tags:
 *       - Timeslider
 *     summary: Get finished plans within a date range (timeslider)
 *     parameters:
 *       - $ref: '#/components/parameters/RegioId'
 *       - name: from
 *         in: query
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-01-01"
 *       - name: to
 *         in: query
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-12-31"
 *     responses:
 *       200:
 *         description: Finished plans with points_data and geometries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FinishedPlan'
 *       400:
 *         description: Missing from/to query params
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /timeslider/pointPlanImages:
 *   get:
 *     tags:
 *       - Timeslider
 *     summary: Get attachment images for a point across finished plans
 *     parameters:
 *       - $ref: '#/components/parameters/RegioId'
 *       - name: point_id
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 3268
 *       - name: plan_ids
 *         in: query
 *         required: true
 *         description: Comma-separated flight plan IDs
 *         schema:
 *           type: string
 *           example: "115,116"
 *     responses:
 *       200:
 *         description: Attachment list (deduped by attachment id)
 *       400:
 *         description: Missing or invalid point_id / plan_ids
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /timeslider/geometryPlanImages:
 *   get:
 *     tags:
 *       - Timeslider
 *     summary: Get attachment images for a geometry across finished plans
 *     parameters:
 *       - $ref: '#/components/parameters/RegioId'
 *       - name: geometry_id
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *           example: 15
 *       - name: plan_ids
 *         in: query
 *         required: true
 *         description: Comma-separated flight plan IDs
 *         schema:
 *           type: string
 *           example: "115,116"
 *     responses:
 *       200:
 *         description: Attachment list (deduped by attachment id)
 *       400:
 *         description: Missing or invalid geometry_id / plan_ids
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

export {};
