// ============================================================
// ISIP — Alert Service
// ============================================================

import alertRepository from './alert.repository.js';
import ApiError from '../../utils/ApiError.js';
import { PAGINATION } from '../../utils/constants.js';

class AlertService {
  async getAll(query) {
    const page = query.page || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(query.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where = {};
    if (query.zoneId) where.zoneId = query.zoneId;
    if (query.type) where.type = query.type;
    if (query.severity) where.severity = query.severity;
    if (query.acknowledged !== undefined) where.acknowledged = query.acknowledged;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const { data, total } = await alertRepository.findAll({ skip, take: limit, where });
    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id) {
    const alert = await alertRepository.findById(id);
    if (!alert) throw ApiError.notFound('Alert not found');
    return alert;
  }

  async create(data) {
    return alertRepository.create(data);
  }

  async update(id, data) {
    await this.getById(id);
    return alertRepository.update(id, data);
  }

  async delete(id) {
    await this.getById(id);
    await alertRepository.delete(id);
  }
}

export default new AlertService();
