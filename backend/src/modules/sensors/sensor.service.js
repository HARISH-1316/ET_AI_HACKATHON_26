// ============================================================
// ISIP — Sensor Service
// ============================================================

import sensorRepository from './sensor.repository.js';
import ApiError from '../../utils/ApiError.js';
import { PAGINATION } from '../../utils/constants.js';

class SensorService {
  async getAll(query) {
    const page = query.page || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(query.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where = {};
    if (query.zoneId) where.zoneId = query.zoneId;
    if (query.equipmentId) where.equipmentId = query.equipmentId;
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const { data, total } = await sensorRepository.findAll({ skip, take: limit, where });
    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id) {
    const sensor = await sensorRepository.findById(id);
    if (!sensor) throw ApiError.notFound('Sensor not found');
    return sensor;
  }

  async create(data) {
    return sensorRepository.create(data);
  }

  async update(id, data) {
    await this.getById(id);
    // Update lastReading timestamp when value changes
    if (data.value !== undefined) {
      data.lastReading = new Date();
    }
    return sensorRepository.update(id, data);
  }

  async delete(id) {
    await this.getById(id);
    await sensorRepository.delete(id);
  }
}

export default new SensorService();
