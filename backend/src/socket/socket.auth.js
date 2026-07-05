// ============================================================
// ISIP — Socket.IO Authentication Middleware
// ============================================================

import { verifyToken } from '../utils/jwt.helper.js';
import logger from '../utils/logger.js';

/**
 * Socket.IO authentication middleware.
 * Verifies JWT token from handshake auth or query.
 */
export function socketAuthMiddleware(socket, next) {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace('Bearer ', '') ||
      socket.handshake.query?.token;

    if (!token) {
      // Allow unauthenticated connections in development for easier testing
      logger.warn(`[Socket Auth] No token provided for socket ${socket.id}`);
      socket.user = null;
      return next();
    }

    const decoded = verifyToken(token);
    socket.user = decoded;
    next();
  } catch (error) {
    logger.warn(`[Socket Auth] Invalid token for socket ${socket.id}: ${error.message}`);
    // Still allow connection but without user context
    socket.user = null;
    next();
  }
}
