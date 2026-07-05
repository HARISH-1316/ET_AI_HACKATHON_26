// ============================================================
// ISIP — Socket.IO Connection Handler
// ============================================================

import logger from '../../utils/logger.js';
import { SOCKET_EVENTS } from '../../utils/constants.js';

/**
 * Register core connection/disconnection handlers.
 */
export function registerConnectionHandlers(io, socket) {
  const userId = socket.user?.id || 'anonymous';
  logger.info(`[Socket] Client connected: ${socket.id} (user: ${userId})`);

  // Join user-specific room for targeted messaging
  if (socket.user?.id) {
    socket.join(`user:${socket.user.id}`);
    logger.debug(`[Socket] ${socket.id} joined room user:${socket.user.id}`);
  }

  // ── Ping / Pong ──────────────────────────────────────
  socket.on('ping', (callback) => {
    if (typeof callback === 'function') {
      callback({ pong: true, timestamp: new Date().toISOString() });
    }
  });

  // ── Join Zone Room ───────────────────────────────────
  socket.on('zone:join', (zoneId) => {
    socket.join(`zone:${zoneId}`);
    logger.debug(`[Socket] ${socket.id} joined room zone:${zoneId}`);
  });

  // ── Leave Zone Room ──────────────────────────────────
  socket.on('zone:leave', (zoneId) => {
    socket.leave(`zone:${zoneId}`);
    logger.debug(`[Socket] ${socket.id} left room zone:${zoneId}`);
  });

  // ── Get Connected Users Count ────────────────────────
  socket.on('users:count', async (callback) => {
    const sockets = await io.fetchSockets();
    if (typeof callback === 'function') {
      callback({ count: sockets.length });
    }
  });

  // ── Disconnect Handler ──────────────────────────────
  socket.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
    logger.info(`[Socket] Client disconnected: ${socket.id} (user: ${userId}) — ${reason}`);
  });

  // ── Error Handler ───────────────────────────────────
  socket.on(SOCKET_EVENTS.ERROR, (error) => {
    logger.error(`[Socket] Error from ${socket.id}: ${error.message}`);
  });
}
