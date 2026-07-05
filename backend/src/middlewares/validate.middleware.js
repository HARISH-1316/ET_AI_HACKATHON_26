// ============================================================
// ISIP — Validation Middleware (Zod)
// ============================================================

import ApiError from '../utils/ApiError.js';

/**
 * Validate request against a Zod schema.
 * @param {object} schema — Object with optional body, params, query Zod schemas
 */
const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    if (schema.body) {
      const result = schema.body.safeParse(req.body);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map(
            (issue) => `body.${issue.path.join('.')}: ${issue.message}`
          )
        );
      } else {
        req.body = result.data;
      }
    }

    if (schema.params) {
      const result = schema.params.safeParse(req.params);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map(
            (issue) => `params.${issue.path.join('.')}: ${issue.message}`
          )
        );
      } else {
        req.params = result.data;
      }
    }

    if (schema.query) {
      const result = schema.query.safeParse(req.query);
      if (!result.success) {
        errors.push(
          ...result.error.issues.map(
            (issue) => `query.${issue.path.join('.')}: ${issue.message}`
          )
        );
      } else {
        req.query = result.data;
      }
    }

    if (errors.length > 0) {
      return next(ApiError.badRequest('Validation failed', errors));
    }

    next();
  };
};

export default validate;
