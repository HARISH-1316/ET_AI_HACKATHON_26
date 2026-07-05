// ============================================================
// ISIP — Worker Service
// ============================================================

import workerRepository from './worker.repository.js';
import ApiError from '../../utils/ApiError.js';
import { PAGINATION } from '../../utils/constants.js';

class WorkerService {
  async getAll(query) {
    const page = query.page || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(query.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where = {};
    if (query.zoneId) where.zoneId = query.zoneId;
    if (query.status) where.status = query.status;
    if (query.ppeStatus) where.ppeStatus = query.ppeStatus;
    if (query.riskLevel) where.riskLevel = query.riskLevel;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { badge: { contains: query.search, mode: 'insensitive' } },
        { role: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const { data, total } = await workerRepository.findAll({ skip, take: limit, where });
    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id) {
    const worker = await workerRepository.findById(id);
    if (!worker) throw ApiError.notFound('Worker not found');
    return worker;
  }

  async create(data) {
    const existing = await workerRepository.findByBadge(data.badge);
    if (existing) throw ApiError.conflict('Badge number already assigned');

    return workerRepository.create(data);
  }

  async update(id, data) {
    await this.getById(id);

    if (data.badge) {
      const existing = await workerRepository.findByBadge(data.badge);
      if (existing && existing.id !== id) throw ApiError.conflict('Badge number already in use');
    }

    // Update lastSeen when status changes
    if (data.status || data.zoneId) {
      data.lastSeen = new Date();
    }

    return workerRepository.update(id, data);
  }

  async delete(id) {
    await this.getById(id);
    await workerRepository.delete(id);
  }
}

export default new WorkerService();
