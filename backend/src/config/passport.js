// ============================================================
// ISIP — Passport Configuration
// ============================================================

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import prisma from './database.js';
import env from './env.js';
import { comparePassword } from '../utils/password.helper.js';

/**
 * Local Strategy — email + password authentication.
 */
const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      if (!user.isActive) {
        return done(null, false, { message: 'Account is deactivated' });
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      // Strip password before returning
      const { password: _, ...userWithoutPassword } = user;
      return done(null, userWithoutPassword);
    } catch (error) {
      return done(error);
    }
  }
);

/**
 * JWT Strategy — Bearer token verification.
 */
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.jwt.secret,
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

/**
 * Initialize Passport with both strategies.
 */
export function configurePassport() {
  passport.use('local', localStrategy);
  passport.use('jwt', jwtStrategy);
  return passport;
}

export default passport;
