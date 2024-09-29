import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { secureHasher } from 'src/common/utils/securtiy-hasher';
import { JwtService } from '@nestjs/jwt';
import { JwtObject } from './type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(login: string, password: string) {
    const user = await this.userService.getUser(login);

    if (!user || !(await secureHasher.verify(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtObject = { sub: user.id };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
