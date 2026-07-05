// ============================================================
// ISIP — Socket.IO Manager
// ============================================================

import { createSocketServer } from '../config/socket.js';
import { socketAuthMiddleware } from './socket.auth.js';
import { registerConnectionHandlers } from './handlers/connection.handler.js';
import logger from '../utils/logger.js';
import { SOCKET_NAMESPACES } from '../utils/constants.js';

let io = null;

/**
 * Initialize Socket.IO on the HTTP server.
 */
export function initializeSocket(httpServer) {
  io = createSocketServer(httpServer);

  // Apply authentication middleware to default namespace
  io.use(socketAuthMiddleware);

  // Register connection handlers on default namespace
  io.on('connection', (socket) => {
    registerConnectionHandlers(io, socket);
  });

  // ── Alerts Namespace ──────────────────────────────────
  const alertsNs = io.of(SOCKET_NAMESPACES.ALERTS);
  alertsNs.use(socketAuthMiddleware);
  alertsNs.on('connection', (socket) => {
    logger.info(`[Socket /alerts] Client connected: ${socket.id}`);
    socket.on('disconnect', (reason) => {
      logger.info(`[Socket /alerts] Client disconnected: ${socket.id} — ${reason}`);
    });
  });

  // ── Sensors Namespace ──────────────────────────────────
  const sensorsNs = io.of(SOCKET_NAMESPACES.SENSORS);
  sensorsNs.use(socketAuthMiddleware);
  sensorsNs.on('connection', (socket) => {
    logger.info(`[Socket /sensors] Client connected: ${socket.id}`);
    socket.on('disconnect', (reason) => {
      logger.info(`[Socket /sensors] Client disconnected: ${socket.id} — ${reason}`);
    });
  });

  logger.info('✅ Socket.IO initialized');
  return io;
}

/**
 * Get the Socket.IO server instance.
 */
export function getIO() {
  if (!io) {
    throw new Error('Socket.IO has not been initialized');
  }
  return io;
}
