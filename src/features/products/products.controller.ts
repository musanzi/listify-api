import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CurrentUser } from 'src/core/auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Product } from './entities/product.entity';
import { FilterProductsDto } from './dto/filter-products.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Gallery } from '../galleries/entities/gallery.entity';
import { v4 as uuidv4 } from 'uuid';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateProductDto): Promise<Product> {
    return this.productsService.create(user, dto);
  }

  @Post('gallery/:id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/galleries',
        filename: function (_req, file, cb) {
          cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`);
        },
      }),
    }),
  )
  addGallery(@Param('id') id: string, @UploadedFile() file: Express.Multer.File): Promise<void> {
    return this.productsService.addGallery(id, file);
  }

  @Post('add-cover/:id')
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: './uploads/products/covers',
        filename: function (_req, file, cb) {
          cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`);
        },
      }),
    }),
  )
  addCover(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    return this.productsService.addCover(id, file);
  }

  @Delete('gallery/remove/:id')
  removeGallery(@Param('id') id: string): Promise<void> {
    return this.productsService.removeGallery(id);
  }

  @Get('gallery/:slug')
  findGallery(@Param('slug') slug: string): Promise<Gallery[]> {
    return this.productsService.findGallery(slug);
  }

  @Get()
  findAll(@Query() queryParams: FilterProductsDto): Promise<Product[]> {
    return this.productsService.findAll(queryParams);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string): Promise<Product> {
    return this.productsService.findBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto): Promise<Product> {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.productsService.remove(id);
  }
}
