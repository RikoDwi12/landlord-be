import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthCredential } from 'src/@types/auth.types';
import { AppConfigService } from 'src/config/appConfig.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: AppConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async login(credentials: AuthCredential) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: credentials.email,
      },
    });
    if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
      throw new HttpException(
        'Invalid username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return jwt.sign(
      {
        id: user.id,
      },
      this.config.jwtSecret,
    );
  }

  async validateToken(token: string) {
    return jwt.verify(token, this.config.jwtSecret);
  }
  get config() {
    return this.configService.root.auth;
  }
}
