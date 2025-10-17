import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { CategoriesModule } from './categories/categories.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductSubscriber } from './subscribers/product.subscriber';
import { GalleriesModule } from '../galleries/galleries.module';

@Module({
  imports: [CategoriesModule, TypeOrmModule.forFeature([Product]), GalleriesModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductSubscriber],
})
export class ProductsModule {}
