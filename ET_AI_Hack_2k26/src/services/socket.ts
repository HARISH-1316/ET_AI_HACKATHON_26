// ============================================================
// ISIP — Socket.IO Client Manager
// ============================================================

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socket: Socket | null = null;

export function connectSocket(): Socket {
  if (socket?.connected) return socket;

  const token = localStorage.getItem('accessToken');

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket] Disconnected:', reason);
  });

  socket.on('connect_error', (err) => {
    console.warn('[Socket] Connection error:', err.message);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}

// ── Event Constants ──────────────────────────────────────
export const EVENTS = {
  DASHBOARD_UPDATE: 'dashboard:update',
  SENSOR_UPDATE: 'sensor:update',
  WORKER_UPDATE: 'worker:update',
  WORKER_MOVEMENT: 'worker:movement',
  ALERT_NEW: 'alert:new',
  ALERT_ACKNOWLEDGED: 'alert:acknowledged',
  ALERT_RESOLVED: 'alert:resolved',
  PERMIT_CREATED: 'permit:created',
  PERMIT_UPDATED: 'permit:updated',
  TIMELINE_NEW: 'timeline:new',
  ZONE_UPDATE: 'zone:update',
} as const;
