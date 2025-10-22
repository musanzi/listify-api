import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { UsersService } from 'src/features/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/features/users/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, pass: string): Promise<User> {
    try {
      const user = await this.usersService.findByEmail(email);
      await this.verifyPassword(pass, user.password);
      return user;
    } catch {
      throw new BadRequestException();
    }
  }

  private async verifyPassword(password: string, encrypted: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, encrypted);
    if (!isMatch) throw new BadRequestException();
    return isMatch;
  }

  async signIn(@Req() req: Request): Promise<User> {
    return req['user'] as User;
  }
}
