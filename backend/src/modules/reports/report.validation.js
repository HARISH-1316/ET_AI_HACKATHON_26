// ============================================================
// ISIP — Report Validation Schemas
// ============================================================

import { z } from 'zod';

const idParam = z.object({
  id: z.string().uuid('Invalid report ID'),
});

const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  type: z.enum(['DAILY_SAFETY', 'INCIDENT', 'RISK_ANALYSIS', 'COMPLIANCE', 'WORKER_SAFETY', 'EQUIPMENT_HEALTH']).optional(),
  status: z.enum(['PENDING', 'GENERATING', 'COMPLETED', 'FAILED']).optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ON_DEMAND']).optional(),
  search: z.string().optional(),
});

export const getReportsSchema = { query: querySchema };
export const getReportByIdSchema = { params: idParam };

export const createReportSchema = {
  body: z.object({
    name: z.string().min(1, 'Report name is required').max(150),
    description: z.string().max(500).optional().nullable(),
    type: z.enum(['DAILY_SAFETY', 'INCIDENT', 'RISK_ANALYSIS', 'COMPLIANCE', 'WORKER_SAFETY', 'EQUIPMENT_HEALTH']),
    frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ON_DEMAND']).optional(),
    status: z.enum(['PENDING', 'GENERATING', 'COMPLETED', 'FAILED']).optional(),
    data: z.any().optional().nullable(),
    generatedById: z.string().uuid('Invalid user ID').optional().nullable(),
  }),
};

export const updateReportSchema = {
  params: idParam,
  body: z.object({
    name: z.string().min(1).max(150).optional(),
    description: z.string().max(500).optional().nullable(),
    type: z.enum(['DAILY_SAFETY', 'INCIDENT', 'RISK_ANALYSIS', 'COMPLIANCE', 'WORKER_SAFETY', 'EQUIPMENT_HEALTH']).optional(),
    frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'ON_DEMAND']).optional(),
    status: z.enum(['PENDING', 'GENERATING', 'COMPLETED', 'FAILED']).optional(),
    data: z.any().optional().nullable(),
    generatedById: z.string().uuid().optional().nullable(),
    generatedAt: z.string().datetime().optional().nullable(),
  }),
};

export const deleteReportSchema = { params: idParam };
