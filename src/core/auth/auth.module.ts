import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/features/users/users.module';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { SessionSerializer } from './session.serializer';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, SessionSerializer, LocalAuthGuard, LocalStrategy]
})
export class AuthModule {}
