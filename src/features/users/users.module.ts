import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesModule } from './roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSubscriber } from './subscribers/user.subscriber';

@Module({
  imports: [RolesModule, TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UserSubscriber],
  exports: [UsersService]
})
export class UsersModule {}
