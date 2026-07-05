// ============================================================
// ISIP — Alert Routes
// ============================================================

import { Router } from 'express';
import alertController from './alert.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  getAlertsSchema, getAlertByIdSchema,
  createAlertSchema, updateAlertSchema, deleteAlertSchema,
} from './alert.validation.js';

const router = Router();

/**
 * @swagger
 * /alerts:
 *   get:
 *     summary: Get all alerts
 *     tags: [Alerts]
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
 *         name: severity
 *         schema: { type: string }
 *       - in: query
 *         name: acknowledged
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Alerts retrieved
 */
router.get('/', authenticate, validate(getAlertsSchema), alertController.getAll);

/**
 * @swagger
 * /alerts/{id}:
 *   get:
 *     summary: Get alert by ID
 *     tags: [Alerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Alert retrieved
 */
router.get('/:id', authenticate, validate(getAlertByIdSchema), alertController.getById);

/**
 * @swagger
 * /alerts:
 *   post:
 *     summary: Create a new alert
 *     tags: [Alerts]
 *     responses:
 *       201:
 *         description: Alert created
 */
router.post('/', authenticate, validate(createAlertSchema), alertController.create);

/**
 * @swagger
 * /alerts/{id}:
 *   put:
 *     summary: Update / acknowledge an alert
 *     tags: [Alerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Alert updated
 */
router.put('/:id', authenticate, validate(updateAlertSchema), alertController.update);

/**
 * @swagger
 * /alerts/{id}:
 *   delete:
 *     summary: Delete an alert
 *     tags: [Alerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Alert deleted
 */
router.delete('/:id', authenticate, validate(deleteAlertSchema), alertController.delete);

export default router;
