// ============================================================
// ISIP — Equipment Repository
// ============================================================

import prisma from '../../config/database.js';

class EquipmentRepository {
  async findAll({ skip, take, where }) {
    const [data, total] = await Promise.all([
      prisma.equipment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          zone: { select: { id: true, name: true, code: true } },
          _count: { select: { sensors: true, permits: true } },
        },
      }),
      prisma.equipment.count({ where }),
    ]);
    return { data, total };
  }

  async findById(id) {
    return prisma.equipment.findUnique({
      where: { id },
      include: {
        zone: { select: { id: true, name: true, code: true } },
        sensors: true,
        permits: {
          include: {
            permit: { select: { id: true, title: true, status: true, type: true } },
          },
        },
      },
    });
  }

  async findByCode(code) {
    return prisma.equipment.findUnique({ where: { code } });
  }

  async create(data) {
    return prisma.equipment.create({
      data,
      include: { zone: { select: { id: true, name: true, code: true } } },
    });
  }

  async update(id, data) {
    return prisma.equipment.update({
      where: { id },
      data,
      include: { zone: { select: { id: true, name: true, code: true } } },
    });
  }

  async delete(id) {
    return prisma.equipment.delete({ where: { id } });
  }
}

export default new EquipmentRepository();
