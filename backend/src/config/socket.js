// ============================================================
// ISIP — Socket.IO Configuration
// ============================================================

import { Server } from 'socket.io';
import env from './env.js';

/**
 * Create and configure Socket.IO server.
 */
export function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.cors.origin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  return io;
}

export default createSocketServer;
