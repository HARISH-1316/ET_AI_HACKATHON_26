// ============================================================
// ISIP — Rate Limiter Middleware
// ============================================================

import rateLimit from 'express-rate-limit';
import env from '../config/env.js';

const rateLimiter = rateLimit({
  windowMs: env.rateLimit.windowMs,
  max: env.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    timestamp: new Date().toISOString(),
  },
});

export default rateLimiter;
