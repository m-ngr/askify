import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from 'src/config/jwt.config.service';
import { isPublic } from './public.decorator';
import { JwtObject } from './type';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private jwtConfigService: JwtConfigService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (isPublic(context)) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync<JwtObject>(token, {
        secret: this.jwtConfigService.secret,
      });
      const user = await this.userService.findOne(payload.sub);
      request['user'] = user;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
