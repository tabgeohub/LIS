/**
 * @openapi
 * /geometries:
 *   get:
 *     tags:
 *       - Geometries
 *     summary: Get all geometries with nested points
 *     parameters:
 *       - $ref: '#/components/parameters/RegioFilter'
 *     responses:
 *       200:
 *         description: List of geometries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   omschrijving:
 *                     type: string
 *                   type:
 *                     type: string
 *                     enum: [line, polygon]
 *                   regio_id:
 *                     type: string
 *                   points:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Point'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   post:
 *     tags:
 *       - Geometries
 *     summary: Create a geometry (line or polygon) with points
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [line, polygon]
 *               omschrijving:
 *                 type: string
 *               regio_id:
 *                 type: string
 *               points:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Geometry created
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /geometries/{geometry_id}:
 *   get:
 *     tags:
 *       - Geometries
 *     summary: Get a single geometry by ID
 *     parameters:
 *       - name: geometry_id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Geometry with points
 *       404:
 *         description: Geometry not found
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /geometries/{id}:
 *   patch:
 *     tags:
 *       - Geometries
 *     summary: Update geometry metadata and/or points
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
 *         description: Geometry updated
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   delete:
 *     tags:
 *       - Geometries
 *     summary: Delete a geometry
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Geometry deleted
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

export {};
