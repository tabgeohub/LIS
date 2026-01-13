/**
 * @openapi
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
 *           type: string
 *     responses:
 *       200:
 *         description: Flight plan retrieved
 */

/**
 * @openapi
 * /flightPlans/searchedFlightplan/{vluchtnummer}:
 *   get:
 *     tags:
 *       - FlightPlans
 *     summary: Get searched flight plan by number
 *     parameters:
 *       - name: vluchtnummer
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matching flight plan retrieved
 */

/**
 * @openapi
 * /flightPlans:
 *   get:
 *     tags:
 *       - FlightPlans
 *     summary: Get all flight plans
 *     responses:
 *       200:
 *         description: List of all flight plans
 */

/**
 * @openapi
 * /flightPlans/prepreparedFlightPlans:
 *   get:
 *     tags:
 *       - FlightPlans
 *     summary: Get preprepared flight plans
 *     responses:
 *       200:
 *         description: Preprepared flight plans retrieved
 */

/**
 * @openapi
 * /flightPlans/vluchtnummer/{vluchtnummer}:
 *   get:
 *     tags:
 *       - FlightPlans
 *     summary: Get flight plan by number
 *     parameters:
 *       - name: vluchtnummer
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flight plan retrieved by number
 */

/**
 * @openapi
 * /flightPlans/unPreparedPlans:
 *   get:
 *     tags:
 *       - FlightPlans
 *     summary: Get unprepared flight plans
 *     responses:
 *       200:
 *         description: Unprepared flight plans retrieved
 */

/**
 * @openapi
 * /flightPlans/preparedFlighPlans:
 *   get:
 *     tags:
 *       - FlightPlans
 *     summary: Get prepared flight plans
 *     responses:
 *       200:
 *         description: Prepared flight plans retrieved
 */

/**
 * @openapi
 * /flightPlans/fullPreparedFlightPlans:
 *   get:
 *     tags:
 *       - FlightPlans
 *     summary: Get fully prepared flight plans
 *     responses:
 *       200:
 *         description: Full prepared flight plans retrieved
 */

/**
 * @openapi
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
 *           type: string
 *     responses:
 *       200:
 *         description: Flight plan deleted
 */

/**
 * @openapi
 * /flightPlans:
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
 *               regio:
 *                 type: string
 *               status:
 *                 type: string
 *             required:
 *               - vluchtnummer
 *               - regio
 *     responses:
 *       201:
 *         description: Flight plan created successfully
 */

/**
 * @openapi
 * /flightPlans/vluchtplans:
 *   patch:
 *     tags:
 *       - FlightPlans
 *     summary: Update a flight plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Flight plan updated
 */

/**
 * @openapi
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
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */

/**
 * @openapi
 * /flightPlans/vluchtplans/points:
 *   patch:
 *     tags:
 *       - FlightPlans
 *     summary: Update points of a flight plan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flightPlanId:
 *                 type: string
 *               points:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Flight plan points updated
 */
