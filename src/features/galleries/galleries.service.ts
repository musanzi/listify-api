import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Gallery } from './entities/gallery.entity';
import { Repository } from 'typeorm';
import { promises as fs } from 'fs';

@Injectable()
export class GalleriesService {
  constructor(
    @InjectRepository(Gallery)
    private galleriesRepository: Repository<Gallery>,
  ) {}

  async create(file: Express.Multer.File): Promise<Gallery> {
    try {
      return await this.galleriesRepository.save({
        name: file.filename,
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findOne(id: string): Promise<Gallery> {
    try {
      return await this.galleriesRepository.findOneOrFail({
        where: { id },
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const img = await this.findOne(id);
      await fs.unlink(`./uploads/galleries/${img.name}`);
      await this.galleriesRepository.delete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}
