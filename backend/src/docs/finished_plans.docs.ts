/**
 * @openapi
 * /finished_plans:
 *   get:
 *     tags:
 *       - FinishedPlans
 *     summary: Get all finished flight plans (full detail with attachments)
 *     responses:
 *       200:
 *         description: List of finished flight plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FinishedPlan'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   post:
 *     tags:
 *       - FinishedPlans
 *     summary: Create / finalize a finished flight plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Finished flight plan created
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /finished_plans/getPartialFinishedFlightPlans:
 *   get:
 *     tags:
 *       - FinishedPlans
 *     summary: Get finished plans with points_data and geometries (regio-filtered)
 *     description: Primary endpoint for Nabewerking finished-plan lists. Regio is enforced from session for non-admin users.
 *     parameters:
 *       - $ref: '#/components/parameters/RegioId'
 *     responses:
 *       200:
 *         description: Partial finished plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FinishedPlan'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /finished_plans/getSingleFinishedFlightPlan/{planId}:
 *   get:
 *     tags:
 *       - FinishedPlans
 *     summary: Get one finished flight plan by ID
 *     parameters:
 *       - name: planId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 115
 *     responses:
 *       200:
 *         description: Finished plan (or null if not found)
 *         content:
 *           application/json:
 *             schema:
 *               nullable: true
 *               allOf:
 *                 - $ref: '#/components/schemas/FinishedPlan'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /finished_plans/getPlanPath/{planId}:
 *   get:
 *     tags:
 *       - FinishedPlans
 *     summary: Get path / track data for a finished flight plan
 *     parameters:
 *       - name: planId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plan path data
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /finished_plans/getAttachmentsPlanSinglePoint:
 *   get:
 *     tags:
 *       - FinishedPlans
 *     summary: Get attachments for one point on a finished plan
 *     parameters:
 *       - name: planId
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *       - name: pointId
 *         in: query
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attachment list (empty array if none)
 *       400:
 *         description: Missing planId or pointId
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /finished_plans/attachment:
 *   post:
 *     tags:
 *       - FinishedPlans
 *     summary: Add an attachment to a finished plan point
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Attachment created
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /finished_plans/points/{data}:
 *   delete:
 *     tags:
 *       - FinishedPlans
 *     summary: Delete a point from a finished plan
 *     parameters:
 *       - name: data
 *         in: path
 *         required: true
 *         description: Encoded point/plan identifier (see route implementation)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Point removed from finished plan
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /finished_plans/points/finishedPointAttachments:
 *   patch:
 *     tags:
 *       - FinishedPlans
 *     summary: Update attachments on a finished plan point
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Attachments updated
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

export {};
