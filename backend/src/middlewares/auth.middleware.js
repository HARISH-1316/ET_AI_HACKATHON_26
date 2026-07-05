// ============================================================
// ISIP — Authentication Middleware
// ============================================================

import passport from 'passport';
import ApiError from '../utils/ApiError.js';

/**
 * JWT authentication middleware.
 * Verifies the Bearer token and attaches user to req.user.
 */
export const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(
        ApiError.unauthorized(info?.message || 'Authentication required')
      );
    }
    req.user = user;
    next();
  })(req, res, next);
};

/**
 * Role-based authorization middleware.
 * Must be used AFTER authenticate.
 * @param  {...string} roles — Allowed user roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }
    if (roles.length && !roles.includes(req.user.role)) {
      return next(
        ApiError.forbidden(
          `Role '${req.user.role}' is not authorized to access this resource`
        )
      );
    }
    next();
  };
};
