import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gallery } from './entities/gallery.entity';
import { GalleriesService } from './galleries.service';

@Module({
  imports: [TypeOrmModule.forFeature([Gallery])],
  providers: [GalleriesService],
  exports: [GalleriesService],
})
export class GalleriesModule {}
