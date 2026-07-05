// ============================================================
// ISIP — Password Helper (bcrypt)
// ============================================================

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password.
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain-text password against a hash.
 */
export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
