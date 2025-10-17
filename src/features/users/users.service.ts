import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { FilterUsersDto } from './dto/filter-users.dto';
import { promises as fs } from 'fs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    try {
      return await this.usersRepository.save({
        ...dto,
        roles: dto.roles.map((id) => ({ id })),
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findAll(queryParams: FilterUsersDto): Promise<User[]> {
    const { page = 1, q } = queryParams;
    const queryBuilder = this.usersRepository.createQueryBuilder('u');
    if (q) queryBuilder.andWhere('u.name LIKE :q OR u.email LIKE :q', { q: `%${q}%` });
    return await queryBuilder
      .leftJoinAndSelect('u.roles', 'r')
      .orderBy('u.created_at', 'DESC')
      .skip(page ? (+page - 1) * 30 : 0)
      .take(30)
      .getMany();
  }

  async findOne(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneOrFail({
        where: { id },
        relations: ['roles'],
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOneOrFail({
        where: { email },
        relations: ['roles'],
      });
      const roles = user.roles.map((role) => role.name);
      return { ...user, roles } as unknown as User;
    } catch {
      throw new NotFoundException();
    }
  }

  async addAvatar(user: User, file: Express.Multer.File): Promise<User> {
    try {
      const existingUser = await this.findOne(user.id);
      if (existingUser.avatar) await fs.unlink(`./uploads/avatars/${existingUser.avatar}`);
      await this.usersRepository.update(user.id, { avatar: file.filename });
      return this.findByEmail(user.email);
    } catch {
      throw new BadRequestException();
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.findOne(id);
      return await this.usersRepository.save({
        ...user,
        ...dto,
        roles: dto.roles ? dto.roles.map((id) => ({ id })) : user.roles,
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.usersRepository.softDelete(id);
    } catch {
      throw new NotFoundException();
    }
  }
}
