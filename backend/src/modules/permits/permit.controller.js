// ============================================================
// ISIP — Permit Controller
// ============================================================

import permitService from './permit.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';

class PermitController {
  getAll = asyncHandler(async (req, res) => {
    const { data, pagination } = await permitService.getAll(req.query);
    ApiResponse.paginated(res, 'Permits retrieved', data, pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const permit = await permitService.getById(req.params.id);
    ApiResponse.ok(res, 'Permit retrieved', permit);
  });

  create = asyncHandler(async (req, res) => {
    const permit = await permitService.create(req.body);
    ApiResponse.created(res, 'Permit created', permit);
  });

  update = asyncHandler(async (req, res) => {
    const permit = await permitService.update(req.params.id, req.body);
    ApiResponse.ok(res, 'Permit updated', permit);
  });

  delete = asyncHandler(async (req, res) => {
    await permitService.delete(req.params.id);
    ApiResponse.ok(res, 'Permit deleted');
  });
}

export default new PermitController();
