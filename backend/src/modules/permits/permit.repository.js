// ============================================================
// ISIP — Permit Repository
// ============================================================

import prisma from '../../config/database.js';

class PermitRepository {
  async findAll({ skip, take, where }) {
    const [data, total] = await Promise.all([
      prisma.permit.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          issuer: { select: { id: true, firstName: true, lastName: true, email: true } },
          zone: { select: { id: true, name: true, code: true } },
          workers: { select: { id: true, name: true, badge: true } },
          equipment: {
            include: { equipment: { select: { id: true, name: true, code: true } } },
          },
        },
      }),
      prisma.permit.count({ where }),
    ]);
    return { data, total };
  }

  async findById(id) {
    return prisma.permit.findUnique({
      where: { id },
      include: {
        issuer: { select: { id: true, firstName: true, lastName: true, email: true } },
        zone: { select: { id: true, name: true, code: true } },
        workers: { select: { id: true, name: true, badge: true, ppeStatus: true, status: true } },
        equipment: {
          include: { equipment: { select: { id: true, name: true, code: true, type: true } } },
        },
      },
    });
  }

  async create(data) {
    return prisma.permit.create({
      data,
      include: {
        issuer: { select: { id: true, firstName: true, lastName: true } },
        zone: { select: { id: true, name: true, code: true } },
      },
    });
  }

  async update(id, data) {
    return prisma.permit.update({
      where: { id },
      data,
      include: {
        issuer: { select: { id: true, firstName: true, lastName: true } },
        zone: { select: { id: true, name: true, code: true } },
        workers: { select: { id: true, name: true, badge: true } },
        equipment: {
          include: { equipment: { select: { id: true, name: true, code: true } } },
        },
      },
    });
  }

  async delete(id) {
    return prisma.permit.delete({ where: { id } });
  }

  async addEquipment(permitId, equipmentId) {
    return prisma.permitEquipment.create({
      data: { permitId, equipmentId },
    });
  }

  async removeEquipment(permitId, equipmentId) {
    return prisma.permitEquipment.delete({
      where: { permitId_equipmentId: { permitId, equipmentId } },
    });
  }

  async setEquipment(permitId, equipmentIds) {
    await prisma.$transaction([
      prisma.permitEquipment.deleteMany({ where: { permitId } }),
      ...equipmentIds.map((equipmentId) =>
        prisma.permitEquipment.create({ data: { permitId, equipmentId } })
      ),
    ]);
  }
}

export default new PermitRepository();
