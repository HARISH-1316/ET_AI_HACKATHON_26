// ============================================================
// ISIP — User Controller
// ============================================================

import userService from './user.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';

class UserController {
  getAll = asyncHandler(async (req, res) => {
    const { data, pagination } = await userService.getAll(req.query);
    ApiResponse.paginated(res, 'Users retrieved', data, pagination);
  });

  getById = asyncHandler(async (req, res) => {
    const user = await userService.getById(req.params.id);
    ApiResponse.ok(res, 'User retrieved', user);
  });

  create = asyncHandler(async (req, res) => {
    const user = await userService.create(req.body);
    ApiResponse.created(res, 'User created', user);
  });

  update = asyncHandler(async (req, res) => {
    const user = await userService.update(req.params.id, req.body);
    ApiResponse.ok(res, 'User updated', user);
  });

  delete = asyncHandler(async (req, res) => {
    await userService.delete(req.params.id);
    ApiResponse.ok(res, 'User deleted');
  });
}

export default new UserController();
