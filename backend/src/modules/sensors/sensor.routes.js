// ============================================================
// ISIP — Sensor Routes
// ============================================================

import { Router } from 'express';
import sensorController from './sensor.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import {
  getSensorsSchema, getSensorByIdSchema,
  createSensorSchema, updateSensorSchema, deleteSensorSchema,
} from './sensor.validation.js';

const router = Router();

/**
 * @swagger
 * /sensors:
 *   get:
 *     summary: Get all sensors
 *     tags: [Sensors]
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
 *         name: equipmentId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Sensors retrieved
 */
router.get('/', authenticate, validate(getSensorsSchema), sensorController.getAll);

/**
 * @swagger
 * /sensors/{id}:
 *   get:
 *     summary: Get sensor by ID
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Sensor retrieved
 */
router.get('/:id', authenticate, validate(getSensorByIdSchema), sensorController.getById);

/**
 * @swagger
 * /sensors:
 *   post:
 *     summary: Create a new sensor
 *     tags: [Sensors]
 *     responses:
 *       201:
 *         description: Sensor created
 */
router.post('/', authenticate, validate(createSensorSchema), sensorController.create);

/**
 * @swagger
 * /sensors/{id}:
 *   put:
 *     summary: Update a sensor
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Sensor updated
 */
router.put('/:id', authenticate, validate(updateSensorSchema), sensorController.update);

/**
 * @swagger
 * /sensors/{id}:
 *   delete:
 *     summary: Delete a sensor
 *     tags: [Sensors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Sensor deleted
 */
router.delete('/:id', authenticate, validate(deleteSensorSchema), sensorController.delete);

export default router;
