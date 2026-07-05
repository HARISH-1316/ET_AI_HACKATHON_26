// ============================================================
// ISIP — Date Helper
// ============================================================

/**
 * Format a date to ISO string.
 */
export function toISO(date) {
  return new Date(date).toISOString();
}

/**
 * Get current timestamp.
 */
export function now() {
  return new Date();
}

/**
 * Check if a date is in the past.
 */
export function isPast(date) {
  return new Date(date) < new Date();
}

/**
 * Check if a date is in the future.
 */
export function isFuture(date) {
  return new Date(date) > new Date();
}

/**
 * Get difference in minutes between two dates.
 */
export function diffInMinutes(dateA, dateB) {
  const diff = Math.abs(new Date(dateA) - new Date(dateB));
  return Math.floor(diff / (1000 * 60));
}

/**
 * Add hours to a date.
 */
export function addHours(date, hours) {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}
