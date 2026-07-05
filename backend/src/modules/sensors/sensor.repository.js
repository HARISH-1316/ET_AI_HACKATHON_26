// ============================================================
// ISIP — Sensor Repository
// ============================================================

import prisma from '../../config/database.js';

class SensorRepository {
  async findAll({ skip, take, where }) {
    const [data, total] = await Promise.all([
      prisma.sensor.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          zone: { select: { id: true, name: true, code: true } },
          equipment: { select: { id: true, name: true, code: true } },
        },
      }),
      prisma.sensor.count({ where }),
    ]);
    return { data, total };
  }

  async findById(id) {
    return prisma.sensor.findUnique({
      where: { id },
      include: {
        zone: { select: { id: true, name: true, code: true } },
        equipment: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async create(data) {
    return prisma.sensor.create({
      data,
      include: {
        zone: { select: { id: true, name: true, code: true } },
        equipment: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async update(id, data) {
    return prisma.sensor.update({
      where: { id },
      data,
      include: {
        zone: { select: { id: true, name: true, code: true } },
        equipment: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async delete(id) {
    return prisma.sensor.delete({ where: { id } });
  }
}

export default new SensorRepository();
