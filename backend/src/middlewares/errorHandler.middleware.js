// ============================================================
// ISIP — Global Error Handler Middleware
// ============================================================

import logger from '../utils/logger.js';
import env from '../config/env.js';

/**
 * Global error handler. Catches all errors forwarded by next(err).
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational !== undefined ? err.isOperational : false;

  // Log non-operational (unexpected) errors with full stack
  if (!isOperational) {
    logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  } else {
    logger.warn(`Operational error: ${err.message}`);
  }

  const response = {
    success: false,
    message: err.message || 'Internal server error',
    ...(err.errors?.length && { errors: err.errors }),
    ...(env.isDev && { stack: err.stack }),
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
};

export default errorHandler;
