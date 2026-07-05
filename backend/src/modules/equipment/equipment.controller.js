// ============================================================
// ISIP — Equipment Controller
// ============================================================

import equipmentService from './equipment.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';

class EquipmentController {
  getAll = asyncHandler(async (req, res) => {
    const { data, pagination } = await equipmentService.getAll(req.query);
    ApiResponse.paginated(res, 'Equipment retrieved', data, pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const equipment = await equipmentService.getById(req.params.id);
    ApiResponse.ok(res, 'Equipment retrieved', equipment);
  });

  create = asyncHandler(async (req, res) => {
    const equipment = await equipmentService.create(req.body);
    ApiResponse.created(res, 'Equipment created', equipment);
  });

  update = asyncHandler(async (req, res) => {
    const equipment = await equipmentService.update(req.params.id, req.body);
    ApiResponse.ok(res, 'Equipment updated', equipment);
  });

  delete = asyncHandler(async (req, res) => {
    await equipmentService.delete(req.params.id);
    ApiResponse.ok(res, 'Equipment deleted');
  });
}

export default new EquipmentController();
