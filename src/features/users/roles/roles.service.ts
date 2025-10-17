import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { FilterRolesDto } from './dto/filter-roles.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    try {
      return await this.rolesRepository.save(dto);
    } catch {
      throw new BadRequestException();
    }
  }

  async findAll(qp: FilterRolesDto): Promise<Role[]> {
    const { page = 1, q } = qp;
    const queryBuilder = this.rolesRepository.createQueryBuilder('r');
    if (q) queryBuilder.andWhere('r.name LIKE :q', { q: `%${q}%` });
    return await queryBuilder
      .orderBy('r.created_at', 'DESC')
      .skip(page ? (+page - 1) * 30 : 0)
      .take(30)
      .getMany();
  }

  async findUnpaginated(): Promise<Role[]> {
    return await this.rolesRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Role> {
    try {
      return await this.rolesRepository.findOneOrFail({
        where: { id },
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: string, dto: UpdateRoleDto): Promise<Role> {
    try {
      const role = await this.findOne(id);
      return await this.rolesRepository.save({ ...role, ...dto });
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.rolesRepository.delete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
