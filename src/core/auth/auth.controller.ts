import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { User } from 'src/features/users/entities/user.entity';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  @Public()
  @UseGuards(LocalAuthGuard)
  signIn(@Req() req: Request): Promise<User> {
    return this.authService.signIn(req);
  }
}
