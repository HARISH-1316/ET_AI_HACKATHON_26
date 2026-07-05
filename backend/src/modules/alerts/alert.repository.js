// ============================================================
// ISIP — Alert Repository
// ============================================================

import prisma from '../../config/database.js';

class AlertRepository {
  async findAll({ skip, take, where }) {
    const [data, total] = await Promise.all([
      prisma.alert.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          zone: { select: { id: true, name: true, code: true } },
          acknowledgedBy: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      prisma.alert.count({ where }),
    ]);
    return { data, total };
  }

  async findById(id) {
    return prisma.alert.findUnique({
      where: { id },
      include: {
        zone: { select: { id: true, name: true, code: true } },
        acknowledgedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async create(data) {
    return prisma.alert.create({
      data,
      include: {
        zone: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async update(id, data) {
    return prisma.alert.update({
      where: { id },
      data,
      include: {
        zone: { select: { id: true, name: true, code: true } },
        acknowledgedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async delete(id) {
    return prisma.alert.delete({ where: { id } });
  }
}

export default new AlertRepository();
