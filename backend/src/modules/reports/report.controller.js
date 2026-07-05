// ============================================================
// ISIP — Report Controller
// ============================================================

import reportService from './report.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';

class ReportController {
  getAll = asyncHandler(async (req, res) => {
    const { data, pagination } = await reportService.getAll(req.query);
    ApiResponse.paginated(res, 'Reports retrieved', data, pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const report = await reportService.getById(req.params.id);
    ApiResponse.ok(res, 'Report retrieved', report);
  });

  create = asyncHandler(async (req, res) => {
    const report = await reportService.create(req.body);
    ApiResponse.created(res, 'Report created', report);
  });

  update = asyncHandler(async (req, res) => {
    const report = await reportService.update(req.params.id, req.body);
    ApiResponse.ok(res, 'Report updated', report);
  });

  delete = asyncHandler(async (req, res) => {
    await reportService.delete(req.params.id);
    ApiResponse.ok(res, 'Report deleted');
  });
}

export default new ReportController();
