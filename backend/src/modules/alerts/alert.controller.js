// ============================================================
// ISIP — Alert Controller
// ============================================================

import alertService from './alert.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';

class AlertController {
  getAll = asyncHandler(async (req, res) => {
    const { data, pagination } = await alertService.getAll(req.query);
    ApiResponse.paginated(res, 'Alerts retrieved', data, pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const alert = await alertService.getById(req.params.id);
    ApiResponse.ok(res, 'Alert retrieved', alert);
  });

  create = asyncHandler(async (req, res) => {
    const alert = await alertService.create(req.body);
    ApiResponse.created(res, 'Alert created', alert);
  });

  update = asyncHandler(async (req, res) => {
    const alert = await alertService.update(req.params.id, req.body);
    ApiResponse.ok(res, 'Alert updated', alert);
  });

  delete = asyncHandler(async (req, res) => {
    await alertService.delete(req.params.id);
    ApiResponse.ok(res, 'Alert deleted');
  });
}

export default new AlertController();
