import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRoleBodyDto, FindRoleQueryDto, UpdateRoleBodyDto } from './dto';
import { PrismaService } from '../prisma';
import type { Prisma, User } from '@prisma/client';
import { dotToObject } from 'src/utils';
import { PERMISSIONS, modules } from './permission.const';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) { }
  async create(data: CreateRoleBodyDto) {
    if (
      await this.prisma.role.findFirst({
        where: { name: data.name, deleted_at: null },
      })
    ) {
      throw new HttpException('Role name already exists', HttpStatus.CONFLICT);
    }
    return await this.prisma.role.create({ data });
  }

  async findAll(query: FindRoleQueryDto) {
    //TODO: short filter search dan pagination

    const filter: Prisma.RoleWhereInput[] = [];
    let search: Prisma.RoleWhereInput[] = [];
    if (query.search) {
      search = [
        {
          name: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }
    const res = await this.prisma.extended.role.paginate({
      limit: query.limit || 10,
      page: query.page,
      where: {
        deleted_at: null,
        AND: [
          ...filter,
          {
            OR: search,
          },
        ],
      },
      orderBy: dotToObject(query.orderBy, query.orderDirection),
    });
    return {
      ...res,
      hasNextPage: res.hasNextPage,
    };
  }

  findOne(id: number, where?: Prisma.RoleWhereInput) {
    return this.prisma.role.findFirst({
      where: { id, deleted_at: null, ...where },
    });
  }

  async update(id: number, data: UpdateRoleBodyDto) {
    if (
      await this.prisma.role.findFirst({
        where: { name: data.name, id: { not: id }, deleted_at: null },
      })
    ) {
      throw new HttpException('Role name already exists', HttpStatus.CONFLICT);
    }
    return await this.prisma.role.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.prisma.role.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async abilityFor(
    user: User,
  ): Promise<{ action: string; resource: string }[]> {
    const userRole = await this.prisma.role.findFirstOrThrow({
      where: {
        user_roles: {
          some: {
            user_id: user.id,
          },
        },
      },
    });
    return userRole.permissions.map((permission) => {
      const [resource, action = 'manage'] = permission.split('.');
      return {
        action: action == '*' ? 'manage' : action,
        resource: resource == '*' ? 'all' : resource,
      };
    });
  }

  allPermission(){
    return modules.map(m=>({
      resource: m,
      permissions: PERMISSIONS.filter(p=>p.startsWith(m+"."))
    }))
  }
}
