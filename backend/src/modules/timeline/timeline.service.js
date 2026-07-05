// ============================================================
// ISIP — Timeline Service
// ============================================================

import timelineRepository from './timeline.repository.js';
import ApiError from '../../utils/ApiError.js';
import { PAGINATION } from '../../utils/constants.js';

class TimelineService {
  async getAll(query) {
    const page = query.page || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(query.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where = {};
    if (query.zoneId) where.zoneId = query.zoneId;
    if (query.category) where.category = query.category;
    if (query.severity) where.severity = query.severity;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const { data, total } = await timelineRepository.findAll({ skip, take: limit, where });
    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id) {
    const event = await timelineRepository.findById(id);
    if (!event) throw ApiError.notFound('Timeline event not found');
    return event;
  }

  async create(data) {
    if (data.timestamp) {
      data.timestamp = new Date(data.timestamp);
    }
    return timelineRepository.create(data);
  }

  async update(id, data) {
    await this.getById(id);
    if (data.timestamp) {
      data.timestamp = new Date(data.timestamp);
    }
    return timelineRepository.update(id, data);
  }

  async delete(id) {
    await this.getById(id);
    await timelineRepository.delete(id);
  }
}

export default new TimelineService();
