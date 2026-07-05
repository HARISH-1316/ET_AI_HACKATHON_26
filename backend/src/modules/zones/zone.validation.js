// ============================================================
// ISIP — Zone Validation Schemas
// ============================================================

import { z } from 'zod';

const idParam = z.object({
  id: z.string().uuid('Invalid zone ID'),
});

const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  riskLevel: z.enum(['SAFE', 'LOW', 'MODERATE', 'WARNING', 'CRITICAL']).optional(),
  search: z.string().optional(),
});

export const getZonesSchema = { query: querySchema };
export const getZoneByIdSchema = { params: idParam };

export const createZoneSchema = {
  body: z.object({
    name: z.string().min(1, 'Zone name is required').max(100),
    code: z.string().min(1, 'Zone code is required').max(20),
    description: z.string().max(500).optional(),
    riskLevel: z.enum(['SAFE', 'LOW', 'MODERATE', 'WARNING', 'CRITICAL']).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
};

export const updateZoneSchema = {
  params: idParam,
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    code: z.string().min(1).max(20).optional(),
    description: z.string().max(500).optional().nullable(),
    riskLevel: z.enum(['SAFE', 'LOW', 'MODERATE', 'WARNING', 'CRITICAL']).optional(),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
};

export const deleteZoneSchema = { params: idParam };
