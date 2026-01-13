/**
 * @openapi
 * /points:
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
 *               name:
 *                 type: string
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *             required:
 *               - name
 *               - coordinates
 *     responses:
 *       201:
 *         description: Point created successfully
 */

/**
 * @openapi
 * /points:
 *   get:
 *     tags:
 *       - Points
 *     summary: Get all points
 *     responses:
 *       200:
 *         description: List of all points
 */

/**
 * @openapi
 * /points/{id}:
 *   get:
 *     tags:
 *       - Points
 *     summary: Get preprepared flight plan points by point ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Preprepared flight plan points retrieved
 */

/**
 * @openapi
 * /points/flightPlans/{pointId}:
 *   get:
 *     tags:
 *       - Points
 *     summary: Get flight plans associated with a point
 *     parameters:
 *       - name: pointId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Flight plans retrieved
 */

/**
 * @openapi
 * /points/searchedPoints/{omschrijving}:
 *   get:
 *     tags:
 *       - Points
 *     summary: Get points by search term
 *     parameters:
 *       - name: omschrijving
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matching points retrieved
 */

/**
 * @openapi
 * /points/duplicatePoints/{omschrijving}:
 *   get:
 *     tags:
 *       - Points
 *     summary: Get duplicate points by description
 *     parameters:
 *       - name: omschrijving
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Duplicate points retrieved
 */

/**
 * @openapi
 * /points/{id}:
 *   patch:
 *     tags:
 *       - Points
 *     summary: Update a point
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
 *               name:
 *                 type: string
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         description: Point updated successfully
 */

/**
 * @openapi
 * /points/{id}:
 *   delete:
 *     tags:
 *       - Points
 *     summary: Delete a point
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Point deleted
 */
