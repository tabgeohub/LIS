/**
 * @openapi
 * /flightPlans:
 *   get:
 *     tags:
 *       - FlightPlans
 *     summary: Get all flight plans (with points and geometries)
 *     parameters:
 *       - $ref: '#/components/parameters/RegioId'
 *     responses:
 *       200:
 *         description: List of flight plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FlightPlan'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   post:
 *     tags:
 *       - FlightPlans
 *     summary: Create a new flight plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vluchtnummer:
 *                 type: string
 *               regio_id:
 *                 type: string
 *               status:
 *                 type: string
 *               points:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Flight plan created
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /flightPlans/flightplan/{id}:
 *   get:
 *     tags:
 *       - FlightPlans
 *     summary: Get a flight plan by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Flight plan with points and layers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FlightPlan'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /flightPlans/searchedFlightplan:
 *   get:
 *     tags:
 *       - FlightPlans
 *     summary: Search flight plans by vluchtnummer or omschrijving
 *     parameters:
 *       - name: search
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           example: test-plan
 *     responses:
 *       200:
 *         description: Matching flight plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FlightPlan'
 *       400:
 *         description: Missing search query parameter
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /flightPlans/prepreparedFlightPlans:
 *   get:
 *     tags:
 *       - FlightPlans
 *     summary: Get pre-prepared flight plans
 *     parameters:
 *       - $ref: '#/components/parameters/RegioId'
 *     responses:
 *       200:
 *         description: Pre-prepared flight plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FlightPlan'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /flightPlans/vluchtnummer/{vluchtnummer}:
 *   get:
 *     tags:
 *       - FlightPlans
 *     summary: Get flight plan by vluchtnummer
 *     parameters:
 *       - name: vluchtnummer
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flight plan
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /flightPlans/unPreparedPlans:
 *   get:
 *     tags:
 *       - FlightPlans
 *     summary: Get unprepared flight plans
 *     parameters:
 *       - $ref: '#/components/parameters/RegioId'
 *     responses:
 *       200:
 *         description: Unprepared flight plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FlightPlan'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /flightPlans/preparedFlighPlans:
 *   get:
 *     tags:
 *       - FlightPlans
 *     summary: Get prepared flight plans (simple list, no point join)
 *     parameters:
 *       - $ref: '#/components/parameters/RegioId'
 *     responses:
 *       200:
 *         description: Prepared flight plans
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /flightPlans/fullPreparedFlightPlans:
 *   get:
 *     tags:
 *       - FlightPlans
 *     summary: Get fully prepared flight plans (with points)
 *     parameters:
 *       - $ref: '#/components/parameters/RegioId'
 *     responses:
 *       200:
 *         description: Full prepared flight plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FlightPlan'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /flightPlans/{id}:
 *   delete:
 *     tags:
 *       - FlightPlans
 *     summary: Delete a flight plan by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Flight plan deleted
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /flightPlans/vluchtplans:
 *   patch:
 *     tags:
 *       - FlightPlans
 *     summary: Update flight plan fields
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Flight plan updated
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /flightPlans/updateFlightPlanStatus:
 *   patch:
 *     tags:
 *       - FlightPlans
 *     summary: Update flight plan status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /flightPlans/vluchtplans/points:
 *   patch:
 *     tags:
 *       - FlightPlans
 *     summary: Update points on a flight plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flightPlanId:
 *                 type: integer
 *               points:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Points updated
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

export {};
