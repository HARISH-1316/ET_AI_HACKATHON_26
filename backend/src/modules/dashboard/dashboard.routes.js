// ============================================================
// ISIP — Dashboard Routes
// ============================================================

import { Router } from 'express';
import dashboardController from './dashboard.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard KPIs
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: KPIs retrieved
 */
router.get('/', authenticate, dashboardController.getKPIs);

export default router;
