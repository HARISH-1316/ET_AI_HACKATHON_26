// ============================================================
// ISIP — Database Configuration (Prisma)
// ============================================================

import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

const prisma = new PrismaClient({
  log: [
    { level: 'error', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
});

prisma.$on('error', (e) => {
  logger.error('Prisma error:', e.message);
});

prisma.$on('warn', (e) => {
  logger.warn('Prisma warning:', e.message);
});

/**
 * Connect to the database and verify connectivity.
 */
export async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('✅ PostgreSQL connected successfully');
  } catch (error) {
    logger.error('❌ PostgreSQL connection failed:', error.message);
    process.exit(1);
  }
}

/**
 * Disconnect from the database gracefully.
 */
export async function disconnectDatabase() {
  await prisma.$disconnect();
  logger.info('PostgreSQL disconnected');
}

export default prisma;
