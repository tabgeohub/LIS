/**
 * @openapi
 * components:
 *   securitySchemes:
 *     sessionCookie:
 *       type: apiKey
 *       in: cookie
 *       name: lis.sid
 *       description: Session cookie set after Keycloak login via the LIS frontend. Log in at the app, then use Try it out here.
 *
 *   parameters:
 *     RegioId:
 *       name: regio_id
 *       in: query
 *       required: false
 *       description: User regio / Keycloak role. **Optional for non-admin** — session role is applied automatically. Admin may pass this to filter (e.g. `RWS NN`). Use `admin` or omit to see all regios.
 *       schema:
 *         type: string
 *         example: RWS NN
 *
 *     RegioFilter:
 *       name: regio
 *       in: query
 *       required: false
 *       description: Regio filter for points/geometries endpoints. Use `admin` to skip filtering.
 *       schema:
 *         type: string
 *         example: RWS NN
 *
 *     PlanId:
 *       name: planId
 *       in: path
 *       required: true
 *       schema:
 *         type: integer
 *         example: 115
 *
 *   responses:
 *     Unauthorized:
 *       description: No valid session (log in via the LIS app first)
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Authentication required
 *
 *     ServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               error:
 *                 type: object
 *
 *   schemas:
 *     Point:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         omschrijving:
 *           type: string
 *         regio_id:
 *           type: string
 *         latitude:
 *           type: number
 *         longitude:
 *           type: number
 *         xcoordinaat_rd:
 *           type: number
 *         ycoordinaat_rd:
 *           type: number
 *         herhalen:
 *           type: integer
 *         organisatie_id:
 *           type: string
 *         user_id:
 *           type: string
 *         datum:
 *           type: string
 *           format: date-time
 *
 *     GeometryGroup:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         geometry_type:
 *           type: string
 *           enum: [line, polygon]
 *         geometry_omschrijving:
 *           type: string
 *         points:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Point'
 *
 *     FlightPlan:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         vluchtnummer:
 *           type: string
 *         omschrijving:
 *           type: string
 *         regio_id:
 *           type: string
 *         status:
 *           type: string
 *         datum:
 *           type: string
 *           format: date-time
 *         points:
 *           type: array
 *           items:
 *             type: integer
 *         points_data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Point'
 *         geometries:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/GeometryGroup'
 *
 *     FinishedPlan:
 *       allOf:
 *         - $ref: '#/components/schemas/FlightPlan'
 *         - type: object
 *           properties:
 *             waarnemer:
 *               type: string
 *             piloot:
 *               type: string
 *             vliegduur:
 *               type: string
 *             path:
 *               type: string
 *             flighttime:
 *               type: string
 */

export {};
