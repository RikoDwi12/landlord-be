import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AppConfigService } from 'src/config/appConfig.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtSrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: AppConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.root.auth.jwtSecret,
    });
  }
  async validate(payload: any, req: Request) {
    const user = await this.prisma.user.findFirst({
      where: { id: payload.id },
      select: { id: true, name: true, email: true, created_at: true },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
