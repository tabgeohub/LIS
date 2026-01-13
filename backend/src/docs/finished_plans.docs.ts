/**
 * @openapi
 * /finished_plans:
 *   post:
 *     tags:
 *       - FinishedPlans
 *     summary: Create a finished flight plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flightPlanId:
 *                 type: string
 *               notes:
 *                 type: string
 *               executedBy:
 *                 type: string
 *             required:
 *               - flightPlanId
 *     responses:
 *       201:
 *         description: Finished flight plan created successfully
 */

/**
 * @openapi
 * /finished_plans:
 *   get:
 *     tags:
 *       - FinishedPlans
 *     summary: Get all finished flight plans
 *     responses:
 *       200:
 *         description: List of finished flight plans
 */

/**
 * @openapi
 * /finished_plans/getPlanPath/{planId}:
 *   get:
 *     tags:
 *       - FinishedPlans
 *     summary: Get path data for a specific finished flight plan
 *     parameters:
 *       - name: planId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Plan path retrieved
 */

/**
 * @openapi
 * /finished_plans/points/{data}:
 *   delete:
 *     tags:
 *       - FinishedPlans
 *     summary: Delete a point from a finished plan
 *     parameters:
 *       - name: data
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Point deleted from finished plan
 */
