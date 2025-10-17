import { User } from './../users/entities/user.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { FilterProductsDto } from './dto/filter-products.dto';
import { promises as fs } from 'fs';
import { GalleriesService } from '../galleries/galleries.service';
import { Gallery } from '../galleries/entities/gallery.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private galleryService: GalleriesService,
  ) {}

  async create(user: User, dto: CreateProductDto): Promise<Product> {
    try {
      return await this.productsRepository.save({
        ...dto,
        categories: dto.categories.map((id) => ({ id })),
        user: { id: user.id },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findAll(queryParams: FilterProductsDto): Promise<Product[]> {
    const { page = 1, q } = queryParams;
    const queryBuilder = this.productsRepository.createQueryBuilder('p');
    if (q) queryBuilder.andWhere('p.name LIKE :q OR p.description LIKE :q', { q: `%${q}%` });
    return await queryBuilder
      .leftJoinAndSelect('p.categories', 'c')
      .orderBy('p.created_at', 'DESC')
      .skip(page ? (+page - 1) * 30 : 0)
      .take(30)
      .getMany();
  }

  async addGallery(id: string, file: Express.Multer.File): Promise<void> {
    try {
      const product = await this.findOne(id);
      const gallery = await this.galleryService.create(file);
      product.galleries = [...product.galleries, gallery];
      await this.productsRepository.save(product);
    } catch {
      throw new BadRequestException();
    }
  }

  async removeGallery(id: string): Promise<void> {
    try {
      await this.galleryService.remove(id);
    } catch {
      throw new BadRequestException();
    }
  }

  async findGallery(slug: string): Promise<Gallery[]> {
    try {
      return (await this.findBySlug(slug)).galleries;
    } catch {
      throw new BadRequestException();
    }
  }

  async addCover(id: string, file: Express.Multer.File): Promise<Product> {
    try {
      const product = await this.findOne(id);
      if (product.cover_image) await fs.unlink(`./uploads/products/covers/${product.cover_image}`);
      return await this.productsRepository.save({ ...product, cover_image: file.filename });
    } catch {
      throw new BadRequestException();
    }
  }

  async findOne(id: string): Promise<Product> {
    try {
      return await this.productsRepository.findOneOrFail({
        where: { id },
        relations: ['categories'],
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async findBySlug(slug: string): Promise<Product> {
    try {
      return await this.productsRepository.findOneOrFail({
        where: { slug },
        relations: ['categories', 'galleries'],
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    try {
      const product = await this.findOne(id);
      return await this.productsRepository.save({
        ...product,
        ...dto,
        categories: dto.categories ? dto.categories.map((id) => ({ id })) : product.categories,
      });
    } catch {
      throw new NotFoundException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.productsRepository.softDelete(id);
    } catch {
      throw new NotFoundException();
    }
  }
}
