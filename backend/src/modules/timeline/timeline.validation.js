// ============================================================
// ISIP — Timeline Validation Schemas
// ============================================================

import { z } from 'zod';

const idParam = z.object({
  id: z.string().uuid('Invalid timeline event ID'),
});

const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  zoneId: z.string().uuid().optional(),
  category: z.enum(['SENSOR', 'WORKER', 'PERMIT', 'EQUIPMENT', 'AI', 'SYSTEM']).optional(),
  severity: z.enum(['INFO', 'WARNING', 'CRITICAL']).optional(),
  search: z.string().optional(),
});

export const getTimelineSchema = { query: querySchema };
export const getTimelineByIdSchema = { params: idParam };

export const createTimelineSchema = {
  body: z.object({
    category: z.enum(['SENSOR', 'WORKER', 'PERMIT', 'EQUIPMENT', 'AI', 'SYSTEM']),
    title: z.string().min(1, 'Title is required').max(200),
    description: z.string().min(1, 'Description is required').max(1000),
    severity: z.enum(['INFO', 'WARNING', 'CRITICAL']).optional().default('INFO'),
    timestamp: z.string().datetime().or(z.string().min(1)).optional(),
    zoneId: z.string().uuid('Invalid zone ID').optional().nullable(),
    relatedId: z.string().max(100).optional().nullable(),
  }),
};

export const updateTimelineSchema = {
  params: idParam,
  body: z.object({
    category: z.enum(['SENSOR', 'WORKER', 'PERMIT', 'EQUIPMENT', 'AI', 'SYSTEM']).optional(),
    title: z.string().min(1).max(200).optional(),
    description: z.string().min(1).max(1000).optional(),
    severity: z.enum(['INFO', 'WARNING', 'CRITICAL']).optional(),
    timestamp: z.string().datetime().or(z.string().min(1)).optional(),
    zoneId: z.string().uuid().optional().nullable(),
    relatedId: z.string().max(100).optional().nullable(),
  }),
};

export const deleteTimelineSchema = { params: idParam };
