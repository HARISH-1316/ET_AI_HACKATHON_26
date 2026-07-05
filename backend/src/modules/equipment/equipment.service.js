// ============================================================
// ISIP — Equipment Service
// ============================================================

import equipmentRepository from './equipment.repository.js';
import ApiError from '../../utils/ApiError.js';
import { PAGINATION } from '../../utils/constants.js';

class EquipmentService {
  async getAll(query) {
    const page = query.page || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(query.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where = {};
    if (query.zoneId) where.zoneId = query.zoneId;
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const { data, total } = await equipmentRepository.findAll({ skip, take: limit, where });
    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id) {
    const equipment = await equipmentRepository.findById(id);
    if (!equipment) throw ApiError.notFound('Equipment not found');
    return equipment;
  }

  async create(data) {
    const existing = await equipmentRepository.findByCode(data.code);
    if (existing) throw ApiError.conflict('Equipment code already exists');

    return equipmentRepository.create(data);
  }

  async update(id, data) {
    await this.getById(id);

    if (data.code) {
      const existing = await equipmentRepository.findByCode(data.code);
      if (existing && existing.id !== id) throw ApiError.conflict('Equipment code already in use');
    }

    return equipmentRepository.update(id, data);
  }

  async delete(id) {
    await this.getById(id);
    await equipmentRepository.delete(id);
  }
}

export default new EquipmentService();
