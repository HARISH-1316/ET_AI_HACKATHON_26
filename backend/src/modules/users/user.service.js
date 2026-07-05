// ============================================================
// ISIP — User Service
// ============================================================

import userRepository from './user.repository.js';
import { hashPassword } from '../../utils/password.helper.js';
import ApiError from '../../utils/ApiError.js';
import { PAGINATION } from '../../utils/constants.js';

class UserService {
  async getAll(query) {
    const page = query.page || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(query.limit || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (page - 1) * limit;

    const where = {};
    if (query.role) where.role = query.role;
    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search, mode: 'insensitive' } },
        { lastName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { username: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const { data, total } = await userRepository.findAll({ skip, take: limit, where });
    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  async create(data) {
    const existingEmail = await userRepository.findByEmail(data.email.toLowerCase());
    if (existingEmail) throw ApiError.conflict('Email already registered');

    const existingUsername = await userRepository.findByUsername(data.username);
    if (existingUsername) throw ApiError.conflict('Username already taken');

    const hashedPassword = await hashPassword(data.password);

    return userRepository.create({
      ...data,
      email: data.email.toLowerCase(),
      password: hashedPassword,
    });
  }

  async update(id, data) {
    await this.getById(id); // Verify exists

    if (data.email) {
      const existing = await userRepository.findByEmail(data.email.toLowerCase());
      if (existing && existing.id !== id) throw ApiError.conflict('Email already in use');
      data.email = data.email.toLowerCase();
    }

    if (data.username) {
      const existing = await userRepository.findByUsername(data.username);
      if (existing && existing.id !== id) throw ApiError.conflict('Username already in use');
    }

    return userRepository.update(id, data);
  }

  async delete(id) {
    await this.getById(id);
    await userRepository.delete(id);
  }
}

export default new UserService();
