// ============================================================
// ISIP — Worker Repository
// ============================================================

import prisma from '../../config/database.js';

class WorkerRepository {
  async findAll({ skip, take, where }) {
    const [data, total] = await Promise.all([
      prisma.worker.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          zone: { select: { id: true, name: true, code: true } },
          permit: { select: { id: true, title: true, type: true, status: true } },
        },
      }),
      prisma.worker.count({ where }),
    ]);
    return { data, total };
  }

  async findById(id) {
    return prisma.worker.findUnique({
      where: { id },
      include: {
        zone: { select: { id: true, name: true, code: true } },
        permit: { select: { id: true, title: true, type: true, status: true, riskLevel: true } },
      },
    });
  }

  async findByBadge(badge) {
    return prisma.worker.findUnique({ where: { badge } });
  }

  async create(data) {
    return prisma.worker.create({
      data,
      include: {
        zone: { select: { id: true, name: true, code: true } },
        permit: { select: { id: true, title: true, type: true, status: true } },
      },
    });
  }

  async update(id, data) {
    return prisma.worker.update({
      where: { id },
      data,
      include: {
        zone: { select: { id: true, name: true, code: true } },
        permit: { select: { id: true, title: true, type: true, status: true } },
      },
    });
  }

  async delete(id) {
    return prisma.worker.delete({ where: { id } });
  }
}

export default new WorkerRepository();
