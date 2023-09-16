import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) { }
  async getHello() {
    console.log('gethello', await this.prisma.user.findMany());
    return { message: 'halo' };
  }
}
