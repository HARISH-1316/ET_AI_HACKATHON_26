// ============================================================
// ISIP — Express Application
// ============================================================

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import env from './config/env.js';
import { configurePassport } from './config/passport.js';
import swaggerSpec from './config/swagger.js';
import rateLimiter from './middlewares/rateLimiter.middleware.js';
import errorHandler from './middlewares/errorHandler.middleware.js';
import notFound from './middlewares/notFound.middleware.js';
import logger from './utils/logger.js';
import { API_PREFIX } from './utils/constants.js';

// Route imports
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/user.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import zoneRoutes from './modules/zones/zone.routes.js';
import equipmentRoutes from './modules/equipment/equipment.routes.js';
import sensorRoutes from './modules/sensors/sensor.routes.js';
import workerRoutes from './modules/workers/worker.routes.js';
import permitRoutes from './modules/permits/permit.routes.js';
import alertRoutes from './modules/alerts/alert.routes.js';
import timelineRoutes from './modules/timeline/timeline.routes.js';
import reportRoutes from './modules/reports/report.routes.js';

const app = express();

// ── Security ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: env.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Compression ──────────────────────────────────────────
app.use(compression());

// ── Logging ──────────────────────────────────────────────
const morganFormat = env.isDev ? 'dev' : 'combined';
app.use(morgan(morganFormat, {
  stream: { write: (message) => logger.http(message.trim()) },
}));

// ── Body Parsing ─────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ── Rate Limiting ────────────────────────────────────────
app.use(rateLimiter);

// ── Passport ─────────────────────────────────────────────
const passport = configurePassport();
app.use(passport.initialize());

// ── Health Check ─────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ISIP Backend is running',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ── Swagger Documentation ────────────────────────────────
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'ISIP API Documentation',
}));

// ── API Routes ───────────────────────────────────────────
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/zones`, zoneRoutes);
app.use(`${API_PREFIX}/equipment`, equipmentRoutes);
app.use(`${API_PREFIX}/sensors`, sensorRoutes);
app.use(`${API_PREFIX}/workers`, workerRoutes);
app.use(`${API_PREFIX}/permits`, permitRoutes);
app.use(`${API_PREFIX}/alerts`, alertRoutes);
app.use(`${API_PREFIX}/timeline`, timelineRoutes);
app.use(`${API_PREFIX}/reports`, reportRoutes);

// ── 404 Handler ──────────────────────────────────────────
app.use(notFound);

// ── Global Error Handler ─────────────────────────────────
app.use(errorHandler);

export default app;
