import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { FilterCategoriesDto } from './dto/filter-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    try {
      return await this.categoryRepository.save({ ...dto });
    } catch {
      throw new BadRequestException();
    }
  }

  async findAll(queryParams: FilterCategoriesDto): Promise<Category[]> {
    const { page = 1, q } = queryParams;
    const queryBuilder = this.categoryRepository.createQueryBuilder('c');
    if (q) queryBuilder.andWhere('c.name LIKE :q', { q: `%${q}%` });
    return await queryBuilder
      .orderBy('c.created_at', 'DESC')
      .skip(page ? (+page - 1) * 30 : 0)
      .take(30)
      .getMany();
  }

  async findUnpaginated(): Promise<Category[]> {
    return await this.categoryRepository.find({
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Category> {
    try {
      return await this.categoryRepository.findOneOrFail({
        where: { id },
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    try {
      const category = await this.findOne(id);
      return await this.categoryRepository.save({ ...category, ...dto });
    } catch {
      throw new NotFoundException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.categoryRepository.delete(id);
    } catch {
      throw new NotFoundException();
    }
  }
}
