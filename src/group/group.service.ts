import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGroupBodyDto, UpdateGroupBodyDto } from './dto';
import { PrismaService } from 'src/prisma';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) { }
  async create(data: CreateGroupBodyDto) {
    if (
      await this.prisma.group.findFirst({
        where: { name: data.name, deleted_at: null },
      })
    ) {
      throw new HttpException('Group name already exists', HttpStatus.CONFLICT);
    }
    return await this.prisma.group.create({ data });
  }

  async findAll() {
    //TODO: short filter search dan pagination
    return await this.prisma.group.findMany({ where: { deleted_at: null } });
  }

  findOne(id: number) {
    return this.prisma.group.findFirst({ where: { id, deleted_at: null } });
  }

  async update(id: number, data: UpdateGroupBodyDto) {
    if (
      await this.prisma.group.findFirst({
        where: { name: data.name, id: { not: id }, deleted_at: null },
      })
    ) {
      throw new HttpException('Group name already exists', HttpStatus.CONFLICT);
    }
    return await this.prisma.group.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.group.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
