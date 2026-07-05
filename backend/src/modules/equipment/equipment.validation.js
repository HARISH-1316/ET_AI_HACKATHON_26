// ============================================================
// ISIP — Equipment Validation Schemas
// ============================================================

import { z } from 'zod';

const idParam = z.object({
  id: z.string().uuid('Invalid equipment ID'),
});

const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  zoneId: z.string().uuid().optional(),
  type: z.enum(['FURNACE', 'CONVERTER', 'BOILER', 'COMPRESSOR', 'TANK', 'MILL', 'CRANE', 'PUMP', 'VALVE', 'ELECTRICAL_PANEL', 'PIPELINE', 'OTHER']).optional(),
  status: z.enum(['OPERATIONAL', 'MAINTENANCE', 'FAULTY', 'OFFLINE', 'DECOMMISSIONED']).optional(),
  search: z.string().optional(),
});

export const getEquipmentListSchema = { query: querySchema };
export const getEquipmentByIdSchema = { params: idParam };

export const createEquipmentSchema = {
  body: z.object({
    name: z.string().min(1, 'Equipment name is required').max(100),
    code: z.string().min(1, 'Equipment code is required').max(20),
    type: z.enum(['FURNACE', 'CONVERTER', 'BOILER', 'COMPRESSOR', 'TANK', 'MILL', 'CRANE', 'PUMP', 'VALVE', 'ELECTRICAL_PANEL', 'PIPELINE', 'OTHER']).optional(),
    status: z.enum(['OPERATIONAL', 'MAINTENANCE', 'FAULTY', 'OFFLINE', 'DECOMMISSIONED']).optional(),
    zoneId: z.string().uuid('Invalid zone ID'),
  }),
};

export const updateEquipmentSchema = {
  params: idParam,
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    code: z.string().min(1).max(20).optional(),
    type: z.enum(['FURNACE', 'CONVERTER', 'BOILER', 'COMPRESSOR', 'TANK', 'MILL', 'CRANE', 'PUMP', 'VALVE', 'ELECTRICAL_PANEL', 'PIPELINE', 'OTHER']).optional(),
    status: z.enum(['OPERATIONAL', 'MAINTENANCE', 'FAULTY', 'OFFLINE', 'DECOMMISSIONED']).optional(),
    zoneId: z.string().uuid().optional(),
  }),
};

export const deleteEquipmentSchema = { params: idParam };
