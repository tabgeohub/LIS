/**
 * @openapi
 * /consts/activiteiten:
 *   get:
 *     tags:
 *       - Consts
 *     summary: Get activiteiten lookup list
 *     responses:
 *       200:
 *         description: List of activiteiten
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /consts/organisaties:
 *   get:
 *     tags:
 *       - Consts
 *     summary: Get organisaties lookup list
 *     responses:
 *       200:
 *         description: List of organisaties
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /consts/piloten:
 *   get:
 *     tags:
 *       - Consts
 *     summary: Get piloten lookup list
 *     responses:
 *       200:
 *         description: List of piloten
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /consts/regios:
 *   get:
 *     tags:
 *       - Consts
 *     summary: Get regios lookup list
 *     responses:
 *       200:
 *         description: List of regios
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /consts/waarnemers:
 *   get:
 *     tags:
 *       - Consts
 *     summary: Get waarnemers lookup list
 *     parameters:
 *       - $ref: '#/components/parameters/RegioId'
 *     responses:
 *       200:
 *         description: List of waarnemers (optionally filtered by regio)
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *
 * /consts/luchtvaartuig:
 *   get:
 *     tags:
 *       - Consts
 *     summary: Get luchtvaartuig lookup list
 *     responses:
 *       200:
 *         description: List of aircraft types
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

export {};
