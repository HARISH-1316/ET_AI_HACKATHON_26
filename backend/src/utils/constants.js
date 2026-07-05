// ============================================================
// ISIP — Constants
// ============================================================

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  SAFETY_OFFICER: 'SAFETY_OFFICER',
  OPERATOR: 'OPERATOR',
  TECHNICIAN: 'TECHNICIAN',
  VIEWER: 'VIEWER',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

export const SOCKET_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  ALERT_NEW: 'alert:new',
  ALERT_UPDATE: 'alert:update',
  SENSOR_UPDATE: 'sensor:update',
  WORKER_UPDATE: 'worker:update',
  ZONE_UPDATE: 'zone:update',
};

export const SOCKET_NAMESPACES = {
  ALERTS: '/alerts',
  SENSORS: '/sensors',
};

export const API_PREFIX = '/api';
