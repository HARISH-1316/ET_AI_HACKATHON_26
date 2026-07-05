// ============================================================
// ISIP — Timeline Repository
// ============================================================

import prisma from '../../config/database.js';

class TimelineRepository {
  async findAll({ skip, take, where }) {
    const [data, total] = await Promise.all([
      prisma.timelineEvent.findMany({
        where,
        skip,
        take,
        orderBy: { timestamp: 'desc' },
        include: {
          zone: { select: { id: true, name: true, code: true } },
        },
      }),
      prisma.timelineEvent.count({ where }),
    ]);
    return { data, total };
  }

  async findById(id) {
    return prisma.timelineEvent.findUnique({
      where: { id },
      include: {
        zone: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async create(data) {
    return prisma.timelineEvent.create({
      data,
      include: {
        zone: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async update(id, data) {
    return prisma.timelineEvent.update({
      where: { id },
      data,
      include: {
        zone: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async delete(id) {
    return prisma.timelineEvent.delete({ where: { id } });
  }
}

export default new TimelineRepository();
