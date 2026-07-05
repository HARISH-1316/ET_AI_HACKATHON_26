// ============================================================
// ISIP — Zone Controller
// ============================================================

import zoneService from './zone.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';

class ZoneController {
  getAll = asyncHandler(async (req, res) => {
    const { data, pagination } = await zoneService.getAll(req.query);
    ApiResponse.paginated(res, 'Zones retrieved', data, pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const zone = await zoneService.getById(req.params.id);
    ApiResponse.ok(res, 'Zone retrieved', zone);
  });

  create = asyncHandler(async (req, res) => {
    const zone = await zoneService.create(req.body);
    ApiResponse.created(res, 'Zone created', zone);
  });

  update = asyncHandler(async (req, res) => {
    const zone = await zoneService.update(req.params.id, req.body);
    ApiResponse.ok(res, 'Zone updated', zone);
  });

  delete = asyncHandler(async (req, res) => {
    await zoneService.delete(req.params.id);
    ApiResponse.ok(res, 'Zone deleted');
  });
}

export default new ZoneController();
