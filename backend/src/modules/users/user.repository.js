// ============================================================
// ISIP — User Repository
// ============================================================

import prisma from '../../config/database.js';

const userSelect = {
  id: true,
  email: true,
  username: true,
  firstName: true,
  lastName: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

class UserRepository {
  async findAll({ skip, take, where }) {
    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: userSelect,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);
    return { data, total };
  }

  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
  }

  async findByEmail(email) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByUsername(username) {
    return prisma.user.findUnique({ where: { username } });
  }

  async create(data) {
    return prisma.user.create({
      data,
      select: userSelect,
    });
  }

  async update(id, data) {
    return prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    });
  }

  async delete(id) {
    return prisma.user.delete({ where: { id } });
  }
}

export default new UserRepository();
