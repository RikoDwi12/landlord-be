import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}
  getHello(): Record<string, any> {
    console.log('gethello', this.prisma);
    return { message: 'halo' };
  }
}
