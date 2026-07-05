// ============================================================
// ISIP — Timeline Controller
// ============================================================

import timelineService from './timeline.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';

class TimelineController {
  getAll = asyncHandler(async (req, res) => {
    const { data, pagination } = await timelineService.getAll(req.query);
    ApiResponse.paginated(res, 'Timeline events retrieved', data, pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const event = await timelineService.getById(req.params.id);
    ApiResponse.ok(res, 'Timeline event retrieved', event);
  });

  create = asyncHandler(async (req, res) => {
    const event = await timelineService.create(req.body);
    ApiResponse.created(res, 'Timeline event created', event);
  });

  update = asyncHandler(async (req, res) => {
    const event = await timelineService.update(req.params.id, req.body);
    ApiResponse.ok(res, 'Timeline event updated', event);
  });

  delete = asyncHandler(async (req, res) => {
    await timelineService.delete(req.params.id);
    ApiResponse.ok(res, 'Timeline event deleted');
  });
}

export default new TimelineController();
