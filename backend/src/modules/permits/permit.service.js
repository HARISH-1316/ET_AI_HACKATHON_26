// ============================================================
// ISIP — Permit Service
// ============================================================

import permitRepository from './permit.repository.js';
import ApiError from '../../utils/ApiError.js';
import { PAGINATION } from '../../utils/constants.js';

class PermitService {
  async getAll(query) {
    const page = query.page || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(query.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where = {};
    if (query.zoneId) where.zoneId = query.zoneId;
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;
    if (query.riskLevel) where.riskLevel = query.riskLevel;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const { data, total } = await permitRepository.findAll({ skip, take: limit, where });
    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id) {
    const permit = await permitRepository.findById(id);
    if (!permit) throw ApiError.notFound('Permit not found');
    return permit;
  }

  async create(data) {
    const { equipmentIds, ...permitData } = data;

    // Parse date strings
    permitData.startTime = new Date(permitData.startTime);
    permitData.endTime = new Date(permitData.endTime);

    const permit = await permitRepository.create(permitData);

    // Link equipment if provided
    if (equipmentIds?.length) {
      await permitRepository.setEquipment(permit.id, equipmentIds);
    }

    return permitRepository.findById(permit.id);
  }

  async update(id, data) {
    await this.getById(id);

    const { equipmentIds, ...permitData } = data;

    if (permitData.startTime) permitData.startTime = new Date(permitData.startTime);
    if (permitData.endTime) permitData.endTime = new Date(permitData.endTime);

    const permit = await permitRepository.update(id, permitData);

    // Update equipment links if provided
    if (equipmentIds !== undefined) {
      await permitRepository.setEquipment(id, equipmentIds);
    }

    return permitRepository.findById(permit.id);
  }

  async delete(id) {
    await this.getById(id);
    await permitRepository.delete(id);
  }
}

export default new PermitService();
