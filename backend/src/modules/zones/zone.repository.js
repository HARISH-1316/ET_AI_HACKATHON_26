// ============================================================
// ISIP — Zone Repository
// ============================================================

import prisma from '../../config/database.js';

class ZoneRepository {
  async findAll({ skip, take, where }) {
    const [data, total] = await Promise.all([
      prisma.zone.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { equipment: true, sensors: true, workers: true, permits: true, alerts: true },
          },
        },
      }),
      prisma.zone.count({ where }),
    ]);
    return { data, total };
  }

  async findById(id) {
    return prisma.zone.findUnique({
      where: { id },
      include: {
        equipment: true,
        sensors: true,
        workers: true,
        permits: { where: { status: 'ACTIVE' } },
        _count: {
          select: { equipment: true, sensors: true, workers: true, permits: true, alerts: true },
        },
      },
    });
  }

  async findByCode(code) {
    return prisma.zone.findUnique({ where: { code } });
  }

  async findByName(name) {
    return prisma.zone.findUnique({ where: { name } });
  }

  async create(data) {
    return prisma.zone.create({ data });
  }

  async update(id, data) {
    return prisma.zone.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.zone.delete({ where: { id } });
  }
}

export default new ZoneRepository();
