// ============================================================
// ISIP — JWT Helper
// ============================================================

import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * Sign a JWT token with user payload.
 */
export function signToken(payload) {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });
}

/**
 * Verify a JWT token.
 */
export function verifyToken(token) {
  return jwt.verify(token, env.jwt.secret);
}

/**
 * Generate token pair for a user.
 */
export function generateAuthTokens(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = signToken(payload);

  return { accessToken };
}
