// ============================================================
// ISIP — Async Handler (wrapper for async route handlers)
// ============================================================

/**
 * Wraps an async Express handler to catch errors and forward them
 * to the global error handler automatically.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
