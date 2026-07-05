// ============================================================
// ISIP — Worker Routes
// ============================================================

import { Router } from 'express';
import workerController from './worker.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  getWorkersSchema, getWorkerByIdSchema,
  createWorkerSchema, updateWorkerSchema, deleteWorkerSchema,
} from './worker.validation.js';

const router = Router();

/**
 * @swagger
 * /workers:
 *   get:
 *     summary: Get all workers
 *     tags: [Workers]
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
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: ppeStatus
 *         schema: { type: string }
 *       - in: query
 *         name: riskLevel
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Workers retrieved
 */
router.get('/', authenticate, validate(getWorkersSchema), workerController.getAll);

/**
 * @swagger
 * /workers/{id}:
 *   get:
 *     summary: Get worker by ID
 *     tags: [Workers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Worker retrieved
 */
router.get('/:id', authenticate, validate(getWorkerByIdSchema), workerController.getById);

/**
 * @swagger
 * /workers:
 *   post:
 *     summary: Create a new worker
 *     tags: [Workers]
 *     responses:
 *       201:
 *         description: Worker created
 */
router.post('/', authenticate, validate(createWorkerSchema), workerController.create);

/**
 * @swagger
 * /workers/{id}:
 *   put:
 *     summary: Update a worker
 *     tags: [Workers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Worker updated
 */
router.put('/:id', authenticate, validate(updateWorkerSchema), workerController.update);

/**
 * @swagger
 * /workers/{id}:
 *   delete:
 *     summary: Delete a worker
 *     tags: [Workers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Worker deleted
 */
router.delete('/:id', authenticate, validate(deleteWorkerSchema), workerController.delete);

export default router;
