// ============================================================
// ISIP — Zone Service
// ============================================================

import zoneRepository from './zone.repository.js';
import ApiError from '../../utils/ApiError.js';
import { PAGINATION } from '../../utils/constants.js';

class ZoneService {
  async getAll(query) {
    const page = query.page || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(query.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where = {};
    if (query.riskLevel) where.riskLevel = query.riskLevel;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const { data, total } = await zoneRepository.findAll({ skip, take: limit, where });
    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id) {
    const zone = await zoneRepository.findById(id);
    if (!zone) throw ApiError.notFound('Zone not found');
    return zone;
  }

  async create(data) {
    const existingName = await zoneRepository.findByName(data.name);
    if (existingName) throw ApiError.conflict('Zone name already exists');

    const existingCode = await zoneRepository.findByCode(data.code);
    if (existingCode) throw ApiError.conflict('Zone code already exists');

    return zoneRepository.create(data);
  }

  async update(id, data) {
    await this.getById(id);

    if (data.name) {
      const existing = await zoneRepository.findByName(data.name);
      if (existing && existing.id !== id) throw ApiError.conflict('Zone name already in use');
    }

    if (data.code) {
      const existing = await zoneRepository.findByCode(data.code);
      if (existing && existing.id !== id) throw ApiError.conflict('Zone code already in use');
    }

    return zoneRepository.update(id, data);
  }

  async delete(id) {
    await this.getById(id);
    await zoneRepository.delete(id);
  }
}

export default new ZoneService();
