// ============================================================
// ISIP — User Validation Schemas
// ============================================================

import { z } from 'zod';

const idParam = z.object({
  id: z.string().uuid('Invalid user ID'),
});

const querySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
  role: z.enum(['ADMIN', 'SAFETY_OFFICER', 'OPERATOR', 'TECHNICIAN', 'VIEWER']).optional(),
  search: z.string().optional(),
});

export const getUsersSchema = { query: querySchema };
export const getUserByIdSchema = { params: idParam };

export const createUserSchema = {
  body: z.object({
    email: z.string().email('Invalid email address'),
    username: z.string().min(3).max(30),
    password: z.string().min(6).max(128),
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    role: z.enum(['ADMIN', 'SAFETY_OFFICER', 'OPERATOR', 'TECHNICIAN', 'VIEWER']).optional(),
    isActive: z.boolean().optional(),
  }),
};

export const updateUserSchema = {
  params: idParam,
  body: z.object({
    email: z.string().email().optional(),
    username: z.string().min(3).max(30).optional(),
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    role: z.enum(['ADMIN', 'SAFETY_OFFICER', 'OPERATOR', 'TECHNICIAN', 'VIEWER']).optional(),
    isActive: z.boolean().optional(),
  }),
};

export const deleteUserSchema = { params: idParam };
