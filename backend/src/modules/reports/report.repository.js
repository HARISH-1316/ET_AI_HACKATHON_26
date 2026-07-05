// ============================================================
// ISIP — Report Repository
// ============================================================

import prisma from '../../config/database.js';

class ReportRepository {
  async findAll({ skip, take, where }) {
    const [data, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          generatedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
      }),
      prisma.report.count({ where }),
    ]);
    return { data, total };
  }

  async findById(id) {
    return prisma.report.findUnique({
      where: { id },
      include: {
        generatedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async create(data) {
    return prisma.report.create({
      data,
      include: {
        generatedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async update(id, data) {
    return prisma.report.update({
      where: { id },
      data,
      include: {
        generatedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async delete(id) {
    return prisma.report.delete({ where: { id } });
  }
}

export default new ReportRepository();
