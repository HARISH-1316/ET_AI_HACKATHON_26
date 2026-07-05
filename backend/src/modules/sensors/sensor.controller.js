// ============================================================
// ISIP — Sensor Controller
// ============================================================

import sensorService from './sensor.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';

class SensorController {
  getAll = asyncHandler(async (req, res) => {
    const { data, pagination } = await sensorService.getAll(req.query);
    ApiResponse.paginated(res, 'Sensors retrieved', data, pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const sensor = await sensorService.getById(req.params.id);
    ApiResponse.ok(res, 'Sensor retrieved', sensor);
  });

  create = asyncHandler(async (req, res) => {
    const sensor = await sensorService.create(req.body);
    ApiResponse.created(res, 'Sensor created', sensor);
  });

  update = asyncHandler(async (req, res) => {
    const sensor = await sensorService.update(req.params.id, req.body);
    ApiResponse.ok(res, 'Sensor updated', sensor);
  });

  delete = asyncHandler(async (req, res) => {
    await sensorService.delete(req.params.id);
    ApiResponse.ok(res, 'Sensor deleted');
  });
}

export default new SensorController();
