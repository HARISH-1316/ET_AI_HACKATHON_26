// ============================================================
// ISIP — Permit Routes
// ============================================================

import { Router } from 'express';
import permitController from './permit.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  getPermitsSchema, getPermitByIdSchema,
  createPermitSchema, updatePermitSchema, deletePermitSchema,
} from './permit.validation.js';

const router = Router();

/**
 * @swagger
 * /permits:
 *   get:
 *     summary: Get all permits
 *     tags: [Permits]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: zoneId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: riskLevel
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Permits retrieved
 */
router.get('/', authenticate, validate(getPermitsSchema), permitController.getAll);

/**
 * @swagger
 * /permits/{id}:
 *   get:
 *     summary: Get permit by ID
 *     tags: [Permits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Permit retrieved
 */
router.get('/:id', authenticate, validate(getPermitByIdSchema), permitController.getById);

/**
 * @swagger
 * /permits:
 *   post:
 *     summary: Create a new permit
 *     tags: [Permits]
 *     responses:
 *       201:
 *         description: Permit created
 */
router.post('/', authenticate, validate(createPermitSchema), permitController.create);

/**
 * @swagger
 * /permits/{id}:
 *   put:
 *     summary: Update a permit
 *     tags: [Permits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Permit updated
 */
router.put('/:id', authenticate, validate(updatePermitSchema), permitController.update);

/**
 * @swagger
 * /permits/{id}:
 *   delete:
 *     summary: Delete a permit
 *     tags: [Permits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Permit deleted
 */
router.delete('/:id', authenticate, validate(deletePermitSchema), permitController.delete);

export default router;
