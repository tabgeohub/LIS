/**
 * @openapi
 * /points:
 *   get:
 *     tags:
 *       - Points
 *     summary: Get points with optional filters
 *     parameters:
 *       - $ref: '#/components/parameters/RegioFilter'
 *       - name: naamAandachtspunt
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by omschrijving (partial match)
 *       - name: activiteit
 *         in: query
 *         schema:
 *           type: string
 *       - name: organisatie
 *         in: query
 *         schema:
 *           type: string
 *       - name: van
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: Created-at from date
 *       - name: tot
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *         description: Created-at to date
 *       - name: herhalen
 *         in: query
 *         schema:
 *           type: integer
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *         description: Single status or comma-separated list; omit or use `all` for no filter
 *       - name: hasGeometry
 *         in: query
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *     responses:
 *       200:
 *         description: List of points
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Point'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   post:
 *     tags:
 *       - Points
 *     summary: Create a new point
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               omschrijving:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               regio_id:
 *                 type: string
 *               organisatie_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Point created
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /points/import:
 *   post:
 *     tags:
 *       - Points
 *     summary: Import points from external data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Points imported
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /points/{id}:
 *   get:
 *     tags:
 *       - Points
 *     summary: Get points for a pre-prepared flight plan
 *     description: Path param `id` is the **flight plan ID**, not a point ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Flight plan ID
 *     responses:
 *       200:
 *         description: Point array for the plan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Point'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   patch:
 *     tags:
 *       - Points
 *     summary: Update a point
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Point updated
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   delete:
 *     tags:
 *       - Points
 *     summary: Delete a point
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Point deleted
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /points/{id}/status:
 *   patch:
 *     tags:
 *       - Points
 *     summary: Update point status
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /points/flightPlans/{pointId}:
 *   get:
 *     tags:
 *       - Points
 *     summary: Get flight plans that contain a point
 *     parameters:
 *       - name: pointId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Flight plans referencing this point
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /points/searchedPoints/{omschrijving}:
 *   get:
 *     tags:
 *       - Points
 *     summary: Search points by omschrijving
 *     parameters:
 *       - name: omschrijving
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matching points
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /points/duplicatePoints/{omschrijving}:
 *   get:
 *     tags:
 *       - Points
 *     summary: Check for duplicate point descriptions
 *     parameters:
 *       - name: omschrijving
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Duplicate check result
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

export {};
