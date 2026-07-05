// ============================================================
// ISIP — Report Service
// ============================================================

import reportRepository from './report.repository.js';
import ApiError from '../../utils/ApiError.js';
import { PAGINATION } from '../../utils/constants.js';

class ReportService {
  async getAll(query) {
    const page = query.page || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(query.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where = {};
    if (query.type) where.type = query.type;
    if (query.status) where.status = query.status;
    if (query.frequency) where.frequency = query.frequency;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const { data, total } = await reportRepository.findAll({ skip, take: limit, where });
    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id) {
    const report = await reportRepository.findById(id);
    if (!report) throw ApiError.notFound('Report not found');
    return report;
  }

  async create(data) {
    return reportRepository.create(data);
  }

  async update(id, data) {
    await this.getById(id);
    if (data.generatedAt) {
      data.generatedAt = new Date(data.generatedAt);
    }
    return reportRepository.update(id, data);
  }

  async delete(id) {
    await this.getById(id);
    await reportRepository.delete(id);
  }
}

export default new ReportService();
